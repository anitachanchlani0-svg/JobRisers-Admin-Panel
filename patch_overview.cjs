const fs = require('fs');
let code = fs.readFileSync('src/pages/Overview.tsx', 'utf8');

const replacement = `
      {selected !== dashboardSections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5 overflow-x-auto">
          {selected === 'Moderation queue summary' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Moderation Queue Summary</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Jobs Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-2">42</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Average Turnaround</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">1.8 hrs</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <p className="text-sm text-muted-foreground font-semibold">Auto-approved (24h)</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">128</p>
                </div>
              </div>
              <table className="w-full border-collapse text-left">
                <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>QUEUE ITEM</th><th>TYPE</th><th>SUBMITTED</th><th>RISK SCORE</th><th>ACTION</th></tr></thead>
                <tbody className="divide-y divide-border/75">
                  <tr><td className="py-3 px-2 text-xs font-semibold">Data Platform Engineer</td><td className="py-3 px-2 text-xs text-muted-foreground">Job Listing</td><td className="py-3 px-2 text-xs text-muted-foreground">2 hrs ago</td><td className="py-3 px-2 text-xs text-rose-600 font-bold">High (Suspicious Links)</td><td className="py-3 px-2"><button className="text-primary text-xs font-semibold">Review</button></td></tr>
                  <tr><td className="py-3 px-2 text-xs font-semibold">Cloudframe Account</td><td className="py-3 px-2 text-xs text-muted-foreground">Employer Verification</td><td className="py-3 px-2 text-xs text-muted-foreground">3 hrs ago</td><td className="py-3 px-2 text-xs text-amber-600 font-bold">Medium</td><td className="py-3 px-2"><button className="text-primary text-xs font-semibold">Review</button></td></tr>
                </tbody>
              </table>
            </div>
          )}
          {selected === 'System health' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold">System Health & API Status</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 border border-border rounded-xl">
                    <h3 className="text-sm font-semibold mb-2">Core Services</h3>
                    <div className="flex justify-between items-center py-2 border-b border-border/50"><span className="text-xs">Database (PostgreSQL)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50"><span className="text-xs">Search (Elasticsearch)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-2"><span className="text-xs">Cache (Redis)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                 </div>
                 <div className="p-4 border border-border rounded-xl">
                    <h3 className="text-sm font-semibold mb-2">External Integrations</h3>
                    <div className="flex justify-between items-center py-2 border-b border-border/50"><span className="text-xs">Payment Gateway (Stripe)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50"><span className="text-xs">Email Delivery (SES)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                    <div className="flex justify-between items-center py-2"><span className="text-xs">Storage (S3)</span><span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Operational</span></div>
                 </div>
              </div>
              <div className="p-4 border border-border rounded-xl bg-rose-50/50">
                 <h3 className="text-sm font-semibold text-rose-800 mb-2">Recent Errors (Last 24h)</h3>
                 <p className="text-xs text-rose-600 mb-1">• 12 failed email deliveries (Bounces)</p>
                 <p className="text-xs text-rose-600 mb-1">• 3 payment failures (Insufficient funds)</p>
                 <p className="text-xs text-rose-600">• 1 API rate limit hit (LinkedIn SSO)</p>
              </div>
            </div>
          )}
        </section>
      ) : (
`;
code = code.replace(/\{selected !== dashboardSections\[0\] \? \([\s\S]*?\) : \(/, replacement);

fs.writeFileSync('src/pages/Overview.tsx', code);
console.log('Overview.tsx updated');
