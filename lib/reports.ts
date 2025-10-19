// Report and moderation system

export interface Report {
  id: string
  reporterId: string
  reporterName: string
  targetId: string
  targetType: "user" | "listing"
  targetName: string
  reason: string
  description?: string
  status: "pending" | "resolved" | "dismissed"
  timestamp: string
  resolvedBy?: string
  resolvedAt?: string
}

const REPORTS_KEY = "unimate_reports"

export const reportsService = {
  // Submit a report
  submitReport: (
    reporterId: string,
    reporterName: string,
    targetId: string,
    targetType: "user" | "listing",
    targetName: string,
    reason: string,
    description?: string,
  ): Report => {
    const reports = reportsService.getAllReports()
    const newReport: Report = {
      id: Date.now().toString(),
      reporterId,
      reporterName,
      targetId,
      targetType,
      targetName,
      reason,
      description,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    reports.push(newReport)
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    return newReport
  },

  // Get all reports
  getAllReports: (): Report[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]")
  },

  // Get pending reports
  getPendingReports: (): Report[] => {
    return reportsService.getAllReports().filter((r) => r.status === "pending")
  },

  // Resolve a report
  resolveReport: (reportId: string, adminId: string, status: "resolved" | "dismissed"): void => {
    const reports = reportsService.getAllReports()
    const reportIndex = reports.findIndex((r) => r.id === reportId)

    if (reportIndex !== -1) {
      reports[reportIndex].status = status
      reports[reportIndex].resolvedBy = adminId
      reports[reportIndex].resolvedAt = new Date().toISOString()
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    }
  },
}
