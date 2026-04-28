import os
import re
import glob

def fix_colors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # Dark Greens
    text = re.sub(r'#052e16|#064e3b|#166534|#065f46|#22c55e|#059669', 'var(--primary)', text, flags=re.IGNORECASE)
    # Light Greens
    text = re.sub(r'#f0fdf4|#ecfdf5|#d1fae5', 'var(--bg-card)', text, flags=re.IGNORECASE)
    # Mid Greens
    text = re.sub(r'#bbf7d0|#a7f3d0|#34d399|#10b981', 'var(--border)', text, flags=re.IGNORECASE)
    # Slate/Gray Dark
    text = re.sub(r'#334155|#1e293b|#0f172a|#475569|#64748b', 'var(--text-2)', text, flags=re.IGNORECASE)
    # Slate/Gray Light
    text = re.sub(r'#f1f5f9|#f8fafc|#e2e8f0|#cbd5e1|#94a3b8|#e5e7eb', 'var(--border)', text, flags=re.IGNORECASE)
    # Blues
    text = re.sub(r'#2563eb|#1d4ed8|#1e40af|#1e3a8a|#3b82f6|#93c5fd|#bfdbfe|#dbeafe|#eff6ff', 'var(--primary)', text, flags=re.IGNORECASE)
    # Yellow/Amber
    text = re.sub(r'#fefce8|#fef3c7|#fffbeb|#ffedd5|#fde68a|#fbbf24|#f59e0b|#d97706|#b45309|#92400e|#78350f|#ffed4a', 'var(--text-3)', text, flags=re.IGNORECASE)
    # Reds
    text = re.sub(r'#fef2f2|#fee2e2|#fecaca|#fca5a5|#f87171|#ef4444|#dc2626|#b91c1c|#991b1b|#7f1d1d', 'var(--text-3)', text, flags=re.IGNORECASE)
    
    # Gradients
    text = re.sub(r'linear-gradient\([^)]+\)', 'var(--bg-card)', text)
    
    # RGBA white overlays
    text = re.sub(r'rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)', 'var(--bg-card)', text)
    
    # White to bg-card
    text = re.sub(r'#fff([^a-fA-F0-9])', r'var(--bg-card)\1', text, flags=re.IGNORECASE)
    text = re.sub(r'#ffffff([^a-fA-F0-9])', r'var(--bg-card)\1', text, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)

files = glob.glob('src/components/AuditPlanning/**/*.tsx', recursive=True) + \
        glob.glob('src/pages/AuditPlanning/**/*.tsx', recursive=True)

for f in files:
    fix_colors(f)
