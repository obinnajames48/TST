#!/usr/bin/env python3
"""Convert hardcoded neutral hex colors -> CSS theme variables for dark/light mode.
Semantic accent colors (lime/purple/profit/loss/amber) are left intact.
Dark accent cards (marked with data-dark) and Match.jsx/Login.jsx are skipped/manual.
"""
import re
import sys

NEUTRAL = [
    ("#FAFAF7", "var(--bg)"),
    ("#F5F5F2", "var(--bg-soft)"),
    ("#FFFFFF", "var(--surface)"),
    ("#ECECEA", "var(--border)"),
    ("#F1F1EF", "var(--border-soft)"),
    ("#F3F4F6", "var(--tag)"),
    ("#1F2024", "var(--ink-soft)"),
    ("#4B5563", "var(--body)"),
    ("#6B7280", "var(--muted)"),
    ("#9CA3AF", "var(--muted-2)"),
    ("#D1D5DB", "var(--muted-2)"),
    ("#E6F4C2", "var(--lime-soft)"),
    ("#EDE7FE", "var(--purple-soft)"),
]


def convert_line(line):
    if "data-dark" in line:
        return line
    # protect lime/dark pairs that must keep fixed colors in both modes
    protections = {
        "bg-[#B4E04C] text-[#0F0F12]": "\u00a7L1\u00a7",
        "text-[#0F0F12] bg-[#B4E04C]": "\u00a7L2\u00a7",
        "bg-[#0F0F12] text-[#B4E04C]": "\u00a7D1\u00a7",
        "text-[#B4E04C] bg-[#0F0F12]": "\u00a7D2\u00a7",
    }
    for k, v in protections.items():
        line = line.replace(k, v)

    # neutral substring map
    for hex_, var in NEUTRAL:
        line = line.replace(hex_, var)

    # bare bg-white / border-white (not opacity variants)
    line = re.sub(r"bg-white(?![\w/-])", "bg-[var(--surface)]", line)
    line = re.sub(r"border-white(?![\w/-])", "border-[var(--surface)]", line)

    # #0F0F12 handling
    was_inverse = "bg-[#0F0F12]" in line
    line = line.replace("bg-[#0F0F12]", "bg-[var(--inverse)]")
    line = line.replace("border-[#0F0F12]", "border-[var(--ink)]")
    line = line.replace("ring-[#0F0F12]", "ring-[var(--ink)]")
    line = line.replace("text-[#0F0F12]", "text-[var(--ink)]")
    line = line.replace("#0F0F12", "var(--ink)")
    if was_inverse:
        line = re.sub(r"text-white(?![\w/-])", "text-[var(--inverse-fg)]", line)

    # strip opacity modifiers on var-arbitrary colors (Tailwind can't alpha a var)
    line = re.sub(r"(\[var\(--[a-z0-9-]+\)\])/\d+", r"\1", line)

    # restore protections
    line = line.replace("\u00a7L1\u00a7", "bg-[#B4E04C] text-[#0F0F12]")
    line = line.replace("\u00a7L2\u00a7", "text-[#0F0F12] bg-[#B4E04C]")
    line = line.replace("\u00a7D1\u00a7", "bg-[#0F0F12] text-[#B4E04C]")
    line = line.replace("\u00a7D2\u00a7", "text-[#B4E04C] bg-[#0F0F12]")
    return line


def main():
    files = sys.argv[1:]
    for path in files:
        with open(path) as f:
            lines = f.readlines()
        new = [convert_line(l) for l in lines]
        with open(path, "w") as f:
            f.writelines(new)
        print("converted", path)


if __name__ == "__main__":
    main()
