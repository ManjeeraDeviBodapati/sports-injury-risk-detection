import datetime
from typing import Dict, Any

def generate_biomechanics_html_report(athlete_name: str, athlete_code: str, activity_type: str, analysis: Dict[str, Any]) -> str:
    """
    Generates a clean, printable HTML Biomechanics Assessment Report.
    """
    eval_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    quality_score = analysis.get("movement_quality_score", 85.0)
    eff_score = analysis.get("biomechanical_efficiency_score", 88.0)
    symmetry = analysis.get("symmetry_index_percent", 92.0)
    deviations = analysis.get("technique_deviations", [])

    deviations_html = ""
    if not deviations:
        deviations_html = "<tr><td colspan='4' style='color:#10b981; font-weight:bold;'>✓ No abnormal biomechanical deviations detected during movement.</td></tr>"
    else:
        for dev in deviations:
            color = "#f43f5e" if dev.get("severity") == "High" else "#f59e0b"
            deviations_html += f"""
            <tr>
                <td><span style="color:{color}; font-weight:bold;">● {dev.get('severity')}</span></td>
                <td><strong>{dev.get('code')}</strong></td>
                <td>{dev.get('metric')}</td>
                <td>{dev.get('finding')}<br/><small style="color:#6b7280;">Risk: {dev.get('associated_risk')}</small></td>
            </tr>
            """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>Biomechanics Assessment Report - {athlete_name}</title>
        <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1f2937; margin: 0; padding: 20px; line-height: 1.5; }}
            .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #06b6d4; padding-bottom: 15px; margin-bottom: 20px; }}
            .title {{ font-size: 24px; font-weight: bold; color: #0891b2; margin: 0; }}
            .subtitle {{ font-size: 14px; color: #6b7280; }}
            .section {{ background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px; }}
            .grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center; }}
            .metric-card {{ background: #ffffff; border: 1px solid #d1d5db; padding: 10px; border-radius: 6px; }}
            .metric-val {{ font-size: 22px; font-weight: bold; color: #0f172a; }}
            .metric-lbl {{ font-size: 11px; color: #6b7280; text-transform: uppercase; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
            th {{ background: #e2e8f0; text-align: left; padding: 8px; font-size: 12px; text-transform: uppercase; }}
            td {{ padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }}
            .footer {{ text-align: center; font-size: 11px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1 class="title">Sports Injury Intelligence Platform</h1>
                <div class="subtitle">Biomechanical Analysis & Pose Estimation Clinical Report</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: bold;">{athlete_name} ({athlete_code})</div>
                <div class="subtitle">Activity: {activity_type} | Date: {eval_date}</div>
            </div>
        </div>

        <div class="section">
            <h3 style="margin-top:0; color:#0f172a;">Executive Movement Scorecard</h3>
            <div class="grid">
                <div class="metric-card">
                    <div class="metric-val" style="color:#06b6d4;">{quality_score} / 100</div>
                    <div class="metric-lbl">Movement Quality</div>
                </div>
                <div class="metric-card">
                    <div class="metric-val" style="color:#8b5cf6;">{eff_score} / 100</div>
                    <div class="metric-lbl">Biomechanical Efficiency</div>
                </div>
                <div class="metric-card">
                    <div class="metric-val" style="color:#10b981;">{symmetry}%</div>
                    <div class="metric-lbl">Limb Symmetry Index</div>
                </div>
                <div class="metric-card">
                    <div class="metric-val" style="color:#f59e0b;">{analysis.get('max_knee_valgus_deg', 0)}°</div>
                    <div class="metric-lbl">Peak Knee Valgus</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h3 style="margin-top:0; color:#0f172a;">Detected Technique Deviations & Biomechanical Risks</h3>
            <table>
                <thead>
                    <tr>
                        <th>Severity</th>
                        <th>Deviation Code</th>
                        <th>Measured Metric</th>
                        <th>Clinical Finding & Risk</th>
                    </tr>
                </thead>
                <tbody>
                    {deviations_html}
                </tbody>
            </table>
        </div>

        <div class="footer">
            Generated by AI Sports Injury Risk Detection Engine (Milestone 2 Operational Pipeline)
        </div>
    </body>
    </html>
    """
    return html_content
