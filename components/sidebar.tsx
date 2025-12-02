"use client"

import {
  getBranches,
  getSemesters,
  getSubjects,
  getBranchName,
  type BranchCode,
  type Semester,
} from "@/lib/branches-data"

interface SidebarProps {
  selectedBranch: BranchCode | ""
  selectedSemester: Semester | ""
  selectedSubject: string
  onBranchChange: (branch: BranchCode | "") => void
  onSemesterChange: (semester: Semester | "") => void
  onSubjectChange: (subject: string) => void
}

export function Sidebar({
  selectedBranch,
  selectedSemester,
  selectedSubject,
  onBranchChange,
  onSemesterChange,
  onSubjectChange,
}: SidebarProps) {
  const branches = getBranches()
  const semesters = getSemesters()
  const subjects = selectedBranch && selectedSemester ? getSubjects(selectedBranch, selectedSemester) : []

  return (
    <aside className="w-80 border-r bg-muted/30 p-6">
      <div className="space-y-6">
        {/* Branch Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Select Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value as BranchCode | "")}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose branch...</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch} - {getBranchName(branch)}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Select Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value ? (Number(e.target.value) as Semester) : "")}
            disabled={!selectedBranch}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Choose semester...</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subject List */}
        {subjects.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium">Select Subject</label>
            <div className="space-y-1 rounded-md border bg-background p-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => onSubjectChange(subject)}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    selectedSubject === subject ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
