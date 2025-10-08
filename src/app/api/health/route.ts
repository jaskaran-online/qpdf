import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import os from "os";

const execAsync = promisify(exec);
const prisma = new PrismaClient();

interface HealthCheck {
  status: "healthy" | "unhealthy" | "warning";
  message: string;
  timestamp: string;
  uptime: number;
  version: string;
  system: {
    platform: string;
    arch: string;
    cpus: number;
    totalMemory: number;
    freeMemory: number;
    loadAverage: number[];
  };
  dependencies: {
    qpdf: {
      installed: boolean;
      version?: string;
      status: "healthy" | "unhealthy" | "warning";
    };
    node: {
      version: string;
      status: "healthy" | "unhealthy" | "warning";
    };
    database: {
      connected: boolean;
      status: "healthy" | "unhealthy" | "warning";
      error?: string;
    };
  };
  disk: {
    total: number;
    free: number;
    status: "healthy" | "unhealthy" | "warning";
  };
  environment: string;
}

async function checkQpdfInstallation(): Promise<{ installed: boolean; version?: string }> {
  try {
    const { stdout } = await execAsync("qpdf --version");
    const version = stdout.trim().split('\n')[0];
    return { installed: true, version };
  } catch (error) {
    return { installed: false };
  }
}

async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error"
    };
  }
}

function getDiskUsage(): { total: number; free: number; status: "healthy" | "unhealthy" | "warning" } {
  try {
    const stats = require('fs').statSync('/');
    const total = stats.blocks * stats.bsize;
    const free = stats.bavail * stats.bsize;
    const usedPercentage = ((total - free) / total) * 100;

    let status: "healthy" | "unhealthy" | "warning" = "healthy";
    if (usedPercentage > 95) {
      status = "unhealthy";
    } else if (usedPercentage > 80) {
      status = "warning";
    }

    return { total, free, status };
  } catch (error) {
    return { total: 0, free: 0, status: "unhealthy" };
  }
}

function getSystemInfo() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const loadAverage = os.loadavg();

  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory,
    freeMemory,
    loadAverage
  };
}

function getVersion(): string {
  try {
    const packageJsonPath = join(process.cwd(), "package.json");
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
      return packageJson.version || "unknown";
    }
  } catch (error) {
    // Ignore error and return unknown
  }
  return "unknown";
}

export async function GET() {
  const startTime = Date.now();
  const healthCheck: HealthCheck = {
    status: "healthy",
    message: "All systems operational",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: getVersion(),
    system: getSystemInfo(),
    dependencies: {
      qpdf: { installed: false, status: "unhealthy" },
      node: { version: process.version, status: "healthy" },
      database: { connected: false, status: "unhealthy" }
    },
    disk: getDiskUsage(),
    environment: process.env.NODE_ENV || "development"
  };

  // Check qpdf installation
  const qpdfCheck = await checkQpdfInstallation();
  healthCheck.dependencies.qpdf = {
    installed: qpdfCheck.installed,
    version: qpdfCheck.version,
    status: qpdfCheck.installed ? "healthy" : "unhealthy"
  };

  // Check database connection
  const dbCheck = await checkDatabaseConnection();
  healthCheck.dependencies.database = {
    connected: dbCheck.connected,
    status: dbCheck.connected ? "healthy" : "unhealthy",
    error: dbCheck.error
  };

  // Determine overall status
  const unhealthyDeps = Object.values(healthCheck.dependencies).filter(dep => dep.status === "unhealthy");
  const warningDeps = Object.values(healthCheck.dependencies).filter(dep => dep.status === "warning");

  if (unhealthyDeps.length > 0) {
    healthCheck.status = "unhealthy";
    healthCheck.message = `${unhealthyDeps.length} dependency(ies) unhealthy`;
  } else if (warningDeps.length > 0 || healthCheck.disk.status !== "healthy") {
    healthCheck.status = "warning";
    healthCheck.message = "Some issues detected but system operational";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    ...healthCheck,
    responseTime: `${responseTime}ms`
  });
}
