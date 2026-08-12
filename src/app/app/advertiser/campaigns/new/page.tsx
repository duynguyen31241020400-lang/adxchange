'use client';
import { useMemo, useState } from 'react';
import { AppShell } from '@/shared/site';
import { venues } from '@/infrastructure/mock-data';

const labels=['Basics','Locations','Schedule','Creative','Budget','Checkout'];
export default function NewCampaign(){
 const [step,setStep]=useState(0); const [selected,setSelected]=useState<string[]>([]); const [budget,setBudget]=useState(80); const [done,setDone]=useState(false);
 const estimated=useMemo(()=>Math.max(20,budget+selected.length*12),[budget,selected.length]);
 const toggle=(id:string)=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 return <AppShell role="advertiser" title="Create campaign"><div className="wizard"><div className="demo-note">Prototype pricing & payment only. Không có giao dịch thật.</div><div className="progress">{labels.map((_,i)=><span className={i<=step?'on':''} key={i}/>)}</div><div className="card">{done?<><div className="kicker">Strong intent signal</div><h2>Campaign request recorded.</h2><p>Trong production, bước này sẽ chuyển sang payment/approval. Trong validation MVP, đây là điểm đo intent cao nhất.</p></>:<>
 <div className="kicker">Step {step+1} · {labels[step]}</div>
 {step===0&&<div><h2>Campaign basics</h2><div className="form-grid"><div className="field"><label>Campaign name</label><input defaultValue="HCMC Hyperlocal Test"/></div><div className="field"><label>Duration</label><select><option>7 days</option><option>14 days</option></select></div></div></div>}
 {step===1&&<div><h2>Choose locations</h2><div className="grid-2"><div className="hero-panel" style={{minHeight:360}}><div className="kicker" style={{color:'white'}}>Map prototype</div><p>Radius là selectable; 3km không được hard-code thành product rule.</p><div className="mock-map"/></div><div className="venue-list">{venues.map(v=><label className="venue-row" key={v.id}><span><b>{v.name}</b><br/><small>{v.category} · {v.district}</small></span><input type="checkbox" checked={selected.includes(v.id)} onChange={()=>toggle(v.id)}/></label>)}</div></div></div>}
 {step===2&&<div><h2>Select time slots</h2><p>Inventory unit chưa được business xác nhận, nên UI hiện chỉ mô phỏng lựa chọn time slot.</p><div className="grid-3">{['06–09','09–12','12–15','15–18','18–21','21–24'].map(t=><label className="card" key={t}><input type="checkbox"/> <b>{t}</b></label>)}</div></div>}
 {step===3&&<div><h2>Upload creative</h2><p>Deck/brief đang dùng creative 9:16; cần xác nhận orientation thực tế của TV trước production.</p><div className="card" style={{borderStyle:'dashed',textAlign:'center',padding:60}}><div className="metric">9:16</div><input type="file" accept="video/*,image/*"/></div></div>}
 {step===4&&<div><h2>Budget & estimate</h2><p>Pricing engine chưa được định nghĩa; số dưới đây chỉ là prototype interaction.</p><div className="field"><label>Demo budget signal: ${budget}</label><input type="range" min="20" max="500" value={budget} onChange={e=>setBudget(Number(e.target.value))}/></div><div className="grid-3" style={{marginTop:20}}><div className="card"><div className="kicker">Selected venues</div><div className="metric">{selected.length}</div></div><div className="card"><div className="kicker">Entry point</div><div className="metric">$20+</div></div><div className="card"><div className="kicker">Prototype total</div><div className="metric">${estimated}</div></div></div></div>}
 {step===5&&<div><h2>Review & request pilot</h2><p>Không giả lập charge thành công. Đây là conversion point để đo advertiser có sẵn sàng đi tới checkout hay không.</p><div className="card"><b>Campaign:</b> HCMC Hyperlocal Test<br/><b>Venues:</b> {selected.length}<br/><b>Prototype estimate:</b> ${estimated}</div></div>}
 <div style={{display:'flex',justifyContent:'space-between',marginTop:24}}><button className="btn btn-secondary" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>← Back</button>{step<5?<button className="btn btn-primary" onClick={()=>setStep(step+1)}>Continue →</button>:<button className="btn btn-primary" onClick={()=>setDone(true)}>Request pilot</button>}</div></>}
 </div></div></AppShell>
}
