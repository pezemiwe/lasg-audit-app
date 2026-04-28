$file = "src/components/AuditPlanning/WorkProgrammeSection.tsx"
$text = Get-Content $file -Raw

$text = $text -replace "#052e16|#064e3b|#166534|#065f46|#22c55e", "var(--primary)"
$text = $text -replace "#f0fdf4|#ecfdf5|#d1fae5", "var(--bg-hover)"
$text = $text -replace "#bbf7d0|#a7f3d0|#34d399|#10b981|#059669", "var(--primary)"
$text = $text -replace "#334155|#1e293b|#0f172a|#475569|#64748b", "var(--text-2)"
$text = $text -replace "#f1f5f9|#f8fafc|#e2e8f0|#cbd5e1|#94a3b8", "var(--border)"
$text = $text -replace "#2563eb|#1d4ed8|#1e40af|#1e3a8a|#3b82f6|#93c5fd|#bfdbfe|#dbeafe|#eff6ff", "var(--primary)"
$text = $text -replace "#fefce8|#fef3c7|#fffbeb|#ffedd5|#fde68a|#fbbf24|#f59e0b|#d97706|#b45309|#92400e|#78350f|#ffed4a", "var(--text)"
$text = $text -replace "#fef2f2|#fee2e2|#fecaca|#fca5a5|#f87171|#ef4444|#dc2626|#b91c1c|#991b1b|#7f1d1d", "var(--text)"
$text = $text -replace 'linear-gradient\([^)]+\)', '"var(--bg-card)"'
$text = $text -replace '"rgba\(255,255,255,0\.[0-9]+\)"', '"var(--border)"'
$text = $text -replace '"#fff"', '"var(--bg-card)"'

Set-Content $file $text
