import { NextResponse } from "next/server";
import prisma from "@/src/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("pageNumber") || "0");
    const size = parseInt(searchParams.get("pageSize") || "20");
    const action = searchParams.get("action");
    const actor = searchParams.get("actor");
    const searchKey = searchParams.get("searchKey");

    const where: any = {};
    if (action) where.action = action;
    if (actor) where.adminName = { contains: actor, mode: 'insensitive' };
    if (searchKey) {
      where.OR = [
        { action: { contains: searchKey, mode: 'insensitive' } },
        { entity: { contains: searchKey, mode: 'insensitive' } },
        { adminName: { contains: searchKey, mode: 'insensitive' } }
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: "desc" }
      }),
      prisma.auditLog.count({ where })
    ]);

    // Map to AuditData shape
    const content = logs.map(l => ({
      guid: l.id,
      actor: l.adminName || "System",
      action: l.action,
      actionMessage: `${l.action} ${l.entity} (${l.entityId || 'N/A'})`,
      entity: l.entity,
      entityId: l.entityId,
      ipAddress: l.ipAddress || "0.0.0.0",
      actionDateTime: l.createdAt.toISOString()
    }));

    return NextResponse.json({
      responseCode: "00",
      responseMessage: "Audit logs retrieved successfully",
      responseData: {
        content,
        totalElements: total,
        totalPages: Math.ceil(total / size),
        pageNumber: page,
        pageSize: size
      },
      success: true
    });
  } catch (error: any) {
    console.error("[Audit API Error]", error);
    return NextResponse.json({
      responseCode: "ERROR",
      responseMessage: "Failed to retrieve audit logs",
      errors: [error.message],
      success: false
    }, { status: 500 });
  }
}
