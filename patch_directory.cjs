const fs = require('fs');
let code = fs.readFileSync('src/pages/Directory.tsx', 'utf8');

// I will just replace the rendering logic for selected !== sections[0]
const replacement = `
      {selected !== sections[0] ? (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 mt-5 overflow-x-auto">
          {kind === 'candidates' && selected === 'Candidate detail' && (
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0edfa] text-primary text-2xl font-bold">AM</div>
                  <div>
                    <h2 className="text-xl font-bold">Aarav Mehta</h2>
                    <p className="text-sm text-muted-foreground">Senior Product Designer · Bengaluru, KA</p>
                    <div className="flex gap-2 mt-2">
                       <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">Active</span>
                       <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">Profile 96% Complete</span>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <h3 className="text-sm font-semibold mb-2">Contact Information (Masked)</h3>
                   <p className="text-xs text-muted-foreground">Email: aa***@mail.com</p>
                   <p className="text-xs text-muted-foreground">Phone: +91 98765 *****</p>
                   <button className="mt-2 text-primary text-xs font-semibold hover:underline">Request Unmask (Audit Logged)</button>
                 </div>
                 <div>
                   <h3 className="text-sm font-semibold mb-2">Account Activity</h3>
                   <p className="text-xs text-muted-foreground">Last active: 12 min ago</p>
                   <p className="text-xs text-muted-foreground">Sign-up source: Google</p>
                   <p className="text-xs text-muted-foreground">Subscription: Pro (Active)</p>
                 </div>
               </div>
            </div>
          )}
          {kind === 'candidates' && selected === 'Deletion requests' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>CANDIDATE</th><th>REQUEST DATE</th><th>STATUS</th><th>SLA</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr><td className="py-3 px-2 text-xs">Meera Iyer</td><td className="py-3 px-2 text-xs text-muted-foreground">Oct 1, 2026</td><td className="py-3 px-2"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-semibold">Pending Review</span></td><td className="py-3 px-2 text-xs text-rose-600">3 Days left</td><td className="py-3 px-2"><button className="text-primary text-xs font-semibold">Process</button></td></tr>
              </tbody>
            </table>
          )}

          {kind === 'employers' && selected === 'Companies' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>COMPANY</th><th>INDUSTRY</th><th>SIZE</th><th>HQ</th><th>VERIFIED</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr><td className="py-3 px-2 text-xs font-semibold">Northstar Labs</td><td className="py-3 px-2 text-xs text-muted-foreground">Technology</td><td className="py-3 px-2 text-xs text-muted-foreground">51-200</td><td className="py-3 px-2 text-xs text-muted-foreground">Bengaluru</td><td className="py-3 px-2 text-xs text-emerald-600">Yes</td></tr>
                <tr><td className="py-3 px-2 text-xs font-semibold">Cloudframe</td><td className="py-3 px-2 text-xs text-muted-foreground">SaaS</td><td className="py-3 px-2 text-xs text-muted-foreground">1-50</td><td className="py-3 px-2 text-xs text-muted-foreground">Pune</td><td className="py-3 px-2 text-xs text-amber-600">No</td></tr>
              </tbody>
            </table>
          )}
          {kind === 'employers' && selected === 'Verification queue' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>COMPANY</th><th>REQUESTER</th><th>DOCUMENTS</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr><td className="py-3 px-2 text-xs font-semibold">Cloudframe</td><td className="py-3 px-2 text-xs text-muted-foreground">Vikram Sethi</td><td className="py-3 px-2 text-xs text-primary cursor-pointer">2 Attachments</td><td className="py-3 px-2"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-semibold">Under review</span></td><td className="py-3 px-2 flex gap-2"><button className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[10px] font-semibold">Approve</button><button className="text-rose-600 bg-rose-50 px-2 py-1 rounded text-[10px] font-semibold">Reject</button></td></tr>
              </tbody>
            </table>
          )}

          {kind === 'jobs' && selected === 'Moderation queue' && (
             <JobsTable rows={list as AdminJob[]} onReview={(job, action) => { setReviewTarget(job); setDecision(action); setReason(''); }} />
          )}
          {kind === 'jobs' && selected === 'Reported jobs' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>JOB</th><th>REPORT REASON</th><th>REPORTS</th><th>STATUS</th><th>ACTION</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr><td className="py-3 px-2 text-xs font-semibold">Data Platform Engineer</td><td className="py-3 px-2 text-xs text-muted-foreground">Suspicious links</td><td className="py-3 px-2 text-xs text-rose-600 font-bold">14</td><td className="py-3 px-2"><span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-[10px] font-semibold">Pending Review</span></td><td className="py-3 px-2 flex gap-2"><button className="text-rose-600 bg-rose-50 px-2 py-1 rounded text-[10px] font-semibold">Remove</button></td></tr>
              </tbody>
            </table>
          )}
          {kind === 'jobs' && selected === 'Imports' && (
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead><tr className="bg-[#faf9fd] text-[9px] font-bold tracking-[.11em] text-muted-foreground"><th>IMPORT ID</th><th>SOURCE</th><th>JOBS CREATED</th><th>DATE</th><th>STATUS</th></tr></thead>
              <tbody className="divide-y divide-border/75">
                <tr><td className="py-3 px-2 text-xs font-semibold">IMP-992</td><td className="py-3 px-2 text-xs text-muted-foreground">Workday API</td><td className="py-3 px-2 text-xs">120</td><td className="py-3 px-2 text-xs text-muted-foreground">Today, 10:00 AM</td><td className="py-3 px-2"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[10px] font-semibold">Success</span></td></tr>
              </tbody>
            </table>
          )}
        </section>
      ) : (
`;
code = code.replace(/\{selected !== sections\[0\] \? \([\s\S]*?\) : \(/, replacement);

fs.writeFileSync('src/pages/Directory.tsx', code);
console.log('Directory.tsx updated');
