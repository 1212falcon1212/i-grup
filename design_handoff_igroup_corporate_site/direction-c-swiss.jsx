// i-group — Kurumsal web sitesi (tek yön)
// Sıcak off-white + indigo/mor accent. Kurumsal ton, sade, ölçülü.
// Projelerde hazır görseller (Unsplash), kolay değiştirilebilir slot yapısı.

(function(){
  const { useState, useEffect, useRef } = React;

  const C = {
    bg:     '#F7F5F0',
    bg2:    '#EDEAE2',
    bg3:    '#E2DDD2',
    ink:    '#111118',
    ink2:   '#3A3A46',
    mute:   '#6E6E78',
    rule:   'rgba(17,17,24,0.12)',
    ruleStrong: 'rgba(17,17,24,0.22)',
    indigo: 'oklch(0.42 0.2 278)',
    indigoSoft: 'oklch(0.62 0.18 278)',
    violet: 'oklch(0.5 0.22 310)',
    sans:   '"Inter", system-ui, sans-serif',
    mono:   '"JetBrains Mono", ui-monospace, monospace',
  };

  // ─── Smart image slot ────────────────────────────────────────
  function Shot({ src, hue = 260, label = '', aspect = '16/10', radius = 6, dark = false }) {
    const [ok, setOk] = useState(!!src);
    useEffect(()=>{ setOk(!!src); }, [src]);
    return (
      <div style={{position:'relative', width:'100%', aspectRatio:aspect, overflow:'hidden', borderRadius:radius, background: dark ? '#111' : C.bg2}}>
        {src && ok && (
          <img src={src} alt={label} loading="lazy" onError={()=>setOk(false)}
            style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block'}}
          />
        )}
        {!ok && (
          <>
            <div style={{position:'absolute', inset:0, background:`linear-gradient(160deg, oklch(0.88 0.06 ${hue}) 0%, oklch(0.62 0.16 ${hue}) 100%)`}}/>
            <div style={{position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 14px)'}}/>
            <div style={{position:'absolute', left:16, bottom:14, right:16, fontFamily:C.mono, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(17,17,24,0.72)'}}>{label || 'görsel'}</div>
          </>
        )}
      </div>
    );
  }

  // Unsplash yardımcı — sabit, optimize URL'ler
  const U = (id, w=1600, h=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

  // Hazır görseller (her yerde kullanılıyor)
  const IMG = {
    heroOffice:     U('photo-1497366216548-37526070297c', 1920, 900),   // modern office, warm
    aboutOffice:    U('photo-1497215842964-222b430dc094', 1200, 1500),  // team meeting warm
    aboutTeam:      U('photo-1522071820081-009f0129c71c', 1200, 1500),  // team collaborating
    newsProduct:    U('photo-1555421689-491a97ff2040', 1400, 800),      // pharmacy / dermocosmetic
    newsSector:     U('photo-1587854692152-cbe660dbde88', 1400, 800),   // cosmetic bottles
    newsCulture:    U('photo-1529070538774-1843cb3265df', 1400, 800),   // team relaxed
    newsInci:       U('photo-1556228720-195a672e8a03', 1400, 800),      // cosmetic ingredients
    careersOffice:  U('photo-1600880292203-757bb62b4baf', 1400, 700),   // office wide
    officeFloor:    U('photo-1604328698692-f76ea9498e76', 1200, 1500),  // architectural office
  };

  // Projelere varsayılan Unsplash görselleri ata (data.jsx'teki img yolu yoksa bunu kullan)
  const PROJECT_IMG_DEFAULTS = {
    'i-eczane':         U('photo-1587854692152-cbe660dbde88', 1400, 900),
    'i-depo':           U('photo-1631549916768-4119b2e5f926', 1400, 900),
    'i-kozmo':          U('photo-1522337360788-8b13dee7a37e', 1400, 900),
    'istanbulvitamin':  U('photo-1571781926291-c477ebfd024b', 1400, 900),
    'specialwhey':      U('photo-1579722821273-0f6c1b5a9b39', 1400, 900),
    'i-hesap':          U('photo-1554224155-6726b3ff858f', 1400, 900),
    'i-hirdavat':       U('photo-1581783898377-1c85bf937427', 1400, 900),
    'i-bijuteri':       U('photo-1611591437281-460bfbe1220a', 1400, 900),
    'i-kirtasiye':      U('photo-1513542789411-b6a5d4f31634', 1400, 900),
    'i-nalbur':         U('photo-1581092160607-ee22621dd758', 1400, 900),
    'i-zeruj':          U('photo-1488459716781-31db52582fe9', 1400, 900),
    'memnuniyetimvar':  U('photo-1556761175-5973dc0f32e7', 1400, 900),
    'i-kira':           U('photo-1560520653-9e0e4c89eb11', 1400, 900),
  };
  const projectImg = (p) => PROJECT_IMG_DEFAULTS[p.id] || p.img;

  // ─── Nav ─────────────────────────────────────────────────────
  function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(()=>{
      const onS = () => setScrolled(window.scrollY > 24);
      window.addEventListener('scroll', onS);
      return () => window.removeEventListener('scroll', onS);
    }, []);
    return (
      <div style={{
        position:'sticky', top:0, zIndex:10,
        background: scrolled ? 'rgba(247,245,240,0.88)' : C.bg,
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? C.rule : 'transparent'}`,
        transition:'background .25s, border-color .25s',
      }}>
        <div style={{maxWidth:1280, margin:'0 auto', padding:'18px 40px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <a style={{display:'flex', alignItems:'center', gap:10, textDecoration:'none'}}>
            <div style={{width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${C.indigo}, ${C.violet})`, position:'relative'}}>
              <div style={{position:'absolute', left:10, top:6, width:4, height:12, borderRadius:2, background:C.bg}}/>
              <div style={{position:'absolute', left:17, top:13, width:4, height:5, borderRadius:2, background:C.bg}}/>
            </div>
            <span style={{fontFamily:C.sans, fontSize:17, fontWeight:700, letterSpacing:'-0.02em', color:C.ink}}>i-group</span>
          </a>
          <nav style={{display:'flex', gap:32, fontFamily:C.sans, fontSize:14, color:C.ink2}}>
            {[
              ['Şirket','#sirket'],
              ['Projeler','#projeler'],
              ['Sektörler','#sektorler'],
              ['Referanslar','#referanslar'],
              ['Blog','#blog'],
              ['Kariyer','#kariyer'],
            ].map(([x,h])=>(
              <a key={x} href={h} style={{color:C.ink2, textDecoration:'none', fontWeight:500}}>{x}</a>
            ))}
          </nav>
          <a href="#iletisim" style={{
            fontFamily:C.sans, fontSize:14, fontWeight:500, padding:'10px 18px',
            background:C.ink, color:C.bg, borderRadius:999, textDecoration:'none',
            display:'inline-flex', alignItems:'center', gap:8,
          }}>İletişime geç <span style={{fontSize:16, lineHeight:1}}>→</span></a>
        </div>
      </div>
    );
  }

  // ─── Hero ────────────────────────────────────────────────────
  function Hero() {
    return (
      <section style={{padding:'72px 40px 96px', maxWidth:1280, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'center'}}>
          <div>
            <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:999, background:C.bg2, fontFamily:C.sans, fontSize:12.5, color:C.ink2, fontWeight:500}}>
              <span style={{width:6, height:6, borderRadius:6, background:'#16a34a', boxShadow:'0 0 8px rgba(22,163,74,0.5)'}}/>
              İstanbul merkezli ürün stüdyosu · 2014’ten beri
            </div>
            <h1 style={{fontFamily:C.sans, fontSize:76, fontWeight:700, lineHeight:1.02, letterSpacing:'-0.035em', color:C.ink, margin:'24px 0 0'}}>
              Eczane, kozmetik ve B2B için <span style={{color:C.indigo}}>ürün geliştiriyoruz.</span>
            </h1>
            <p style={{fontFamily:C.sans, fontSize:19, lineHeight:1.55, color:C.ink2, margin:'28px 0 0', maxWidth:560}}>
              i-group; pazaryerleri, B2B tedarik ağları, mobil uygulamalar, kurumsal muhasebe yazılımı ve tüketici platformlarında uçtan uca ürün üretir ve işletir.
            </p>
            <div style={{display:'flex', gap:14, marginTop:36}}>
              <a href="#projeler" style={{
                fontFamily:C.sans, fontSize:15, fontWeight:500, padding:'14px 24px',
                background:C.ink, color:C.bg, borderRadius:999, textDecoration:'none',
                display:'inline-flex', alignItems:'center', gap:10,
              }}>Projelerimiz <span style={{fontSize:18, lineHeight:1}}>→</span></a>
              <a href="#iletisim" style={{
                fontFamily:C.sans, fontSize:15, fontWeight:500, padding:'14px 24px',
                background:'transparent', color:C.ink, borderRadius:999, textDecoration:'none',
                border:`1px solid ${C.ruleStrong}`,
              }}>Birlikte çalışalım</a>
            </div>
            <div style={{display:'flex', gap:40, marginTop:56}}>
              {[['13','aktif proje'],['6','sektör'],['120K+','son kullanıcı']].map(([k,v])=>(
                <div key={v}>
                  <div style={{fontFamily:C.sans, fontSize:34, fontWeight:700, letterSpacing:'-0.03em', color:C.ink, lineHeight:1}}>{k}</div>
                  <div style={{fontFamily:C.sans, fontSize:13, color:C.mute, marginTop:6}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:'relative'}}>
            <Shot src={IMG.heroOffice} aspect="4/5" radius={12} label="i-group merkez ofis" />
            <div style={{
              position:'absolute', left:-24, bottom:32, padding:'16px 18px',
              background:C.bg, borderRadius:12, boxShadow:'0 12px 28px rgba(17,17,24,0.12)',
              maxWidth:260,
            }}>
              <div style={{fontFamily:C.sans, fontSize:12, color:C.mute, fontWeight:500}}>EKİP</div>
              <div style={{fontFamily:C.sans, fontSize:18, fontWeight:600, color:C.ink, marginTop:4}}>38 kişi, tek çatı</div>
              <div style={{fontFamily:C.sans, fontSize:13, color:C.ink2, marginTop:6, lineHeight:1.45}}>Ürün, tasarım, mühendislik ve operasyon aynı ofiste.</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Section header (temiz kurumsal) ─────────────────────────
  const Sec = ({eyebrow, title, lead, right, id}) => (
    <div id={id} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'end', marginBottom:48}}>
      <div>
        <div style={{fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.indigo, letterSpacing:'0.04em', textTransform:'uppercase'}}>{eyebrow}</div>
        <h2 style={{fontFamily:C.sans, fontSize:52, fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', color:C.ink, margin:'12px 0 0', maxWidth:600}}>{title}</h2>
      </div>
      {(lead || right) && (
        <div style={{fontFamily:C.sans, fontSize:16, lineHeight:1.55, color:C.ink2}}>
          {lead}
          {right}
        </div>
      )}
    </div>
  );

  // ─── About ───────────────────────────────────────────────────
  function About() {
    return (
      <section id="sirket" style={{padding:'96px 40px', maxWidth:1280, margin:'0 auto'}}>
        <Sec
          eyebrow="Hakkımızda"
          title="Bir yazılım stüdyosu; fikirden canlı ürüne."
          lead="2014’te İstanbul’da üç kişilik bir ekiple kuruldu. Bugün 38 kişilik ekibimizle 13 aktif ürünü yayınlıyor, işletiyor ve büyütüyoruz. Ürünü kurmak kadar, ayakta tutmak ve ölçeklendirmek de işimizin bir parçası."
        />
        <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:32}}>
          <div style={{display:'grid', gap:16}}>
            <Shot src={IMG.aboutOffice} aspect="16/11" radius={12} label="ofis · çalışma alanı" />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
              <Shot src={IMG.aboutTeam} aspect="1/1" radius={12} label="ekip" />
              <Shot src={IMG.officeFloor} aspect="1/1" radius={12} label="ofis" />
            </div>
          </div>
          <div style={{display:'grid', gap:18, alignContent:'start'}}>
            {[
              {k:'Odak', v:'Uçtan uca ürün geliştirme', d:'Strateji, tasarım, mühendislik, operasyon — tek ekip, tek takvim.'},
              {k:'Yaklaşım', v:'Sahaya bakar, üretir, ölçer', d:'Eczacıyla sahada, markayla rafta, tüketiciyle uygulamada.'},
              {k:'Altyapı', v:'Paylaşımlı ve ölçekli', d:'Bir üründe çözdüğümüzü diğer ürünlere taşıyoruz.'},
              {k:'Destek', v:'Lansman sonrası devam', d:'Ürünü yayımlamak başlangıçtır; sürdürme sözleşmeleri ile yanında kalırız.'},
            ].map(x=>(
              <div key={x.k} style={{padding:22, border:`1px solid ${C.rule}`, borderRadius:12, background:C.bg}}>
                <div style={{fontFamily:C.sans, fontSize:12, fontWeight:600, color:C.indigo, letterSpacing:'0.06em', textTransform:'uppercase'}}>{x.k}</div>
                <div style={{fontFamily:C.sans, fontSize:20, fontWeight:600, letterSpacing:'-0.015em', color:C.ink, marginTop:6}}>{x.v}</div>
                <div style={{fontFamily:C.sans, fontSize:14, color:C.ink2, marginTop:8, lineHeight:1.55}}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Project Card ───────────────────────────────────────────
  function ProjectCard({ p, featured }) {
    const [hover, setHover] = useState(false);
    const img = projectImg(p);
    const statusColor = p.status==='Yayında' ? '#16a34a' : p.status==='Beta' ? C.indigo : C.violet;
    return (
      <article
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>setHover(false)}
        style={{
          gridColumn: featured ? 'span 8' : 'span 4',
          borderRadius:14, overflow:'hidden',
          background:C.bg, border:`1px solid ${C.rule}`,
          cursor:'pointer',
          transition:'transform .3s cubic-bezier(.2,.7,.3,1), box-shadow .3s',
          transform: hover ? 'translateY(-4px)' : 'none',
          boxShadow: hover ? '0 20px 40px rgba(17,17,24,0.12)' : '0 1px 2px rgba(17,17,24,0.04)',
          display:'flex', flexDirection:'column',
        }}>
        <div style={{position:'relative'}}>
          <Shot src={img} hue={p.hue} label={`${p.name} · ekran görüntüsü`} aspect={featured ? '16/9' : '4/3'} radius={0} />
          <div style={{
            position:'absolute', top:14, left:14, padding:'5px 11px', borderRadius:999,
            background:'rgba(255,255,255,0.92)', backdropFilter:'blur(6px)',
            fontFamily:C.sans, fontSize:11.5, fontWeight:600, color:C.ink, display:'inline-flex', alignItems:'center', gap:6,
          }}>
            <span style={{width:6, height:6, borderRadius:6, background:statusColor}}/>
            {p.status}
          </div>
          <div style={{
            position:'absolute', top:14, right:14, padding:'5px 11px', borderRadius:999,
            background:'rgba(17,17,24,0.72)', backdropFilter:'blur(6px)',
            fontFamily:C.sans, fontSize:11.5, fontWeight:500, color:C.bg,
          }}>{p.tag}</div>
        </div>
        <div style={{padding: featured ? '26px 28px 28px' : '20px 22px 22px', display:'flex', flexDirection:'column', gap:12, flex:1}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12}}>
            <h3 style={{fontFamily:C.sans, fontSize: featured ? 32 : 22, fontWeight:700, letterSpacing:'-0.025em', color:C.ink, margin:0, lineHeight:1.1}}>{p.name}</h3>
            <span style={{fontFamily:C.sans, fontSize:12.5, color:C.mute, fontWeight:500}}>{p.sector}</span>
          </div>
          <p style={{fontFamily:C.sans, fontSize: featured ? 15.5 : 13.5, color:C.ink2, margin:0, lineHeight:1.55, flex:1}}>{p.desc}</p>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, paddingTop:14, borderTop:`1px solid ${C.rule}`}}>
            <span style={{fontFamily:C.sans, fontSize:13, color:C.mute}}>{p.year ? `Lansman · ${p.year}` : 'Yakında'}</span>
            <span style={{
              fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.ink, display:'inline-flex', alignItems:'center', gap:6,
            }}>
              Siteyi görüntüle <span style={{transition:'transform .25s', transform: hover ? 'translateX(4px)' : 'none'}}>→</span>
            </span>
          </div>
        </div>
      </article>
    );
  }

  // ─── Projects ────────────────────────────────────────────────
  function Projects() {
    const [filter, setFilter] = useState('Tümü');
    const tags = ['Tümü', ...Array.from(new Set(window.IG_PROJECTS.map(p=>p.tag)))];
    const filtered = filter==='Tümü' ? window.IG_PROJECTS : window.IG_PROJECTS.filter(p=>p.tag===filter);

    return (
      <section id="projeler" style={{padding:'96px 40px', maxWidth:1280, margin:'0 auto'}}>
        <Sec
          eyebrow="Projeler"
          title="Yayınladığımız ve işlettiğimiz ürünler."
          lead="Eczane pazaryerinden kozmetik e-ticarete, B2B tedarikten kurumsal muhasebe yazılımına kadar birbirini besleyen 13 aktif ürün."
        />
        <div style={{display:'flex', flexWrap:'wrap', gap:8, marginBottom:32}}>
          {tags.map(t => (
            <button key={t} onClick={()=>setFilter(t)} style={{
              fontFamily:C.sans, fontSize:13, fontWeight:500, padding:'10px 16px',
              borderRadius:999, border:`1px solid ${filter===t ? C.ink : C.rule}`,
              background: filter===t ? C.ink : 'transparent',
              color: filter===t ? C.bg : C.ink2,
              cursor:'pointer', transition:'.2s',
            }}>{t} <span style={{marginLeft:6, opacity:0.6}}>{t==='Tümü' ? window.IG_PROJECTS.length : window.IG_PROJECTS.filter(p=>p.tag===t).length}</span></button>
          ))}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:24}}>
          {filtered.map((p,i) => (
            <ProjectCard key={p.id} p={p} featured={i%5 === 0} />
          ))}
        </div>
      </section>
    );
  }

  // ─── Sectors ─────────────────────────────────────────────────
  function Sectors() {
    return (
      <section id="sektorler" style={{background:C.bg2, padding:'96px 40px'}}>
        <div style={{maxWidth:1280, margin:'0 auto'}}>
          <Sec
            eyebrow="Sektörler"
            title="Hizmet verdiğimiz dikeyler."
            lead="Farklı pazarlar, aynı üretim disiplini. Bir sektörde öğrendiğimiz diğerini besliyor."
          />
          <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:16}}>
            {window.IG_SECTORS.map((s,i)=>(
              <div key={s.id} style={{
                gridColumn: (i===0 || i===1) ? 'span 3' : 'span 2',
                padding:'28px 26px', borderRadius:14,
                background: i===1 ? C.ink : C.bg,
                color: i===1 ? C.bg : C.ink,
                border: i===1 ? `1px solid ${C.ink}` : `1px solid ${C.rule}`,
                minHeight:200, display:'flex', flexDirection:'column', justifyContent:'space-between',
              }}>
                <div style={{fontFamily:C.sans, fontSize:56, fontWeight:700, letterSpacing:'-0.04em', lineHeight:1, color: i===1 ? C.indigoSoft : C.indigo}}>{s.count}<span style={{fontSize:18, fontWeight:500, color: i===1 ? 'rgba(247,245,240,0.6)' : C.mute, marginLeft:6}}>ürün</span></div>
                <div>
                  <div style={{fontFamily:C.sans, fontSize:19, fontWeight:600, letterSpacing:'-0.015em', lineHeight:1.25}}>{s.name}</div>
                  <div style={{fontFamily:C.sans, fontSize:13.5, marginTop:8, opacity: i===1 ? 0.75 : 0.7, lineHeight:1.5}}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Clients ─────────────────────────────────────────────────
  function Clients() {
    return (
      <section id="referanslar" style={{padding:'96px 40px', maxWidth:1280, margin:'0 auto'}}>
        <Sec
          eyebrow="Referanslar"
          title="Birlikte çalıştığımız markalar."
          lead="Eczane zincirleri, kozmetik markaları, dağıtıcılar ve kurumsal firmalar."
        />
        <div style={{borderRadius:14, border:`1px solid ${C.rule}`, background:C.bg, overflow:'hidden'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)'}}>
            {window.IG_CLIENTS.map((c,i)=>(
              <div key={c} style={{
                padding:'34px 18px', textAlign:'center',
                fontFamily:C.sans, fontSize:22, fontWeight:700, letterSpacing:'-0.02em', color:C.ink2,
                borderRight: (i%5!==4) ? `1px solid ${C.rule}` : 'none',
                borderBottom: i<5 ? `1px solid ${C.rule}` : 'none',
                transition:'color .2s, background .2s', cursor:'default',
              }}
              onMouseEnter={e=>{e.currentTarget.style.color=C.ink; e.currentTarget.style.background=C.bg2;}}
              onMouseLeave={e=>{e.currentTarget.style.color=C.ink2; e.currentTarget.style.background='transparent';}}
              >{c}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Blog ───────────────────────────────────────────────────
  function Blog() {
    const images = [IMG.newsProduct, IMG.newsSector, IMG.newsCulture, IMG.newsInci];
    const lead = window.IG_NEWS[0];
    const rest = window.IG_NEWS.slice(1);
    return (
      <section id="blog" style={{padding:'96px 40px', background:C.bg2}}>
        <div style={{maxWidth:1280, margin:'0 auto'}}>
          <Sec
            eyebrow="Blog & Haberler"
            title="Ürünlerimizden, sektörlerimizden ve ekibimizden notlar."
            lead="Yaptığımız işten, sektörlerin nabzından ve ekip kültürümüzden yazıyoruz."
          />
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:24}}>
            {/* lead article */}
            <article style={{background:C.bg, borderRadius:14, overflow:'hidden', border:`1px solid ${C.rule}`, cursor:'pointer'}}>
              <Shot src={images[0]} aspect="16/10" radius={0} label="öne çıkan yazı" />
              <div style={{padding:'32px 34px 36px'}}>
                <div style={{display:'inline-flex', padding:'5px 10px', borderRadius:999, background:C.bg2, fontFamily:C.sans, fontSize:12, fontWeight:600, color:C.indigo}}>{lead.tag}</div>
                <h3 style={{fontFamily:C.sans, fontSize:34, fontWeight:700, letterSpacing:'-0.025em', color:C.ink, margin:'14px 0 10px', lineHeight:1.15}}>{lead.title}</h3>
                <p style={{fontFamily:C.sans, fontSize:16, color:C.ink2, margin:0, lineHeight:1.55}}>{lead.excerpt}</p>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:22}}>
                  <div style={{fontFamily:C.sans, fontSize:13, color:C.mute}}>{lead.date}</div>
                  <div style={{fontFamily:C.sans, fontSize:14, fontWeight:600, color:C.ink}}>Yazının tamamı →</div>
                </div>
              </div>
            </article>
            {/* secondary stack */}
            <div style={{display:'grid', gap:16}}>
              {rest.map((n,i)=>(
                <article key={i} style={{
                  background:C.bg, borderRadius:14, border:`1px solid ${C.rule}`, overflow:'hidden',
                  display:'grid', gridTemplateColumns:'1fr 1.4fr', cursor:'pointer',
                }}>
                  <Shot src={images[i+1]} aspect="4/3" radius={0} label={n.tag} />
                  <div style={{padding:'18px 22px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontFamily:C.sans, fontSize:11.5, fontWeight:600, color:C.indigo, letterSpacing:'0.04em', textTransform:'uppercase'}}>{n.tag} · {n.date}</div>
                      <div style={{fontFamily:C.sans, fontSize:18, fontWeight:700, letterSpacing:'-0.02em', color:C.ink, marginTop:6, lineHeight:1.2}}>{n.title}</div>
                      <div style={{fontFamily:C.sans, fontSize:13.5, color:C.ink2, marginTop:8, lineHeight:1.5}}>{n.excerpt}</div>
                    </div>
                    <div style={{fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.ink, marginTop:10}}>Oku →</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Careers ─────────────────────────────────────────────────
  function Careers() {
    return (
      <section id="kariyer" style={{padding:'96px 40px', maxWidth:1280, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:56, alignItems:'start'}}>
          <div style={{position:'sticky', top:100}}>
            <div style={{fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.indigo, letterSpacing:'0.04em', textTransform:'uppercase'}}>Kariyer</div>
            <h2 style={{fontFamily:C.sans, fontSize:48, fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', color:C.ink, margin:'12px 0 0'}}>
              Ekibimize katılın.
            </h2>
            <p style={{fontFamily:C.sans, fontSize:16, lineHeight:1.6, color:C.ink2, margin:'20px 0 24px'}}>
              Uzak ya da İstanbul, tercih sizin. Uçtan uca ürün geliştirdiğimiz 13 ürüne doğrudan dokunacaksınız.
            </p>
            <Shot src={IMG.careersOffice} aspect="4/3" radius={12} label="ofis" />
          </div>
          <div>
            <div style={{fontFamily:C.sans, fontSize:13, fontWeight:500, color:C.mute, marginBottom:14}}>{window.IG_JOBS.length} açık pozisyon</div>
            <div style={{borderRadius:14, border:`1px solid ${C.rule}`, overflow:'hidden', background:C.bg}}>
              {window.IG_JOBS.map((j,i)=>(
                <div key={i} style={{
                  display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 40px',
                  gap:20, alignItems:'center', padding:'22px 26px',
                  borderBottom: i<window.IG_JOBS.length-1 ? `1px solid ${C.rule}` : 'none',
                  cursor:'pointer', transition:'background .15s',
                }}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg2}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  <div>
                    <div style={{fontFamily:C.sans, fontSize:19, fontWeight:600, letterSpacing:'-0.02em', color:C.ink}}>{j.role}</div>
                    <div style={{fontFamily:C.sans, fontSize:13, color:C.mute, marginTop:4}}>Tam zamanlı</div>
                  </div>
                  <div style={{fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.indigo}}>{j.team}</div>
                  <div style={{fontFamily:C.sans, fontSize:13.5, color:C.ink2}}>{j.loc}</div>
                  <div style={{fontFamily:C.sans, fontSize:20, color:C.ink2, textAlign:'right'}}>→</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:24, padding:'22px 26px', borderRadius:14, background:C.bg2, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontFamily:C.sans, fontSize:15, fontWeight:600, color:C.ink}}>Listede yok mu?</div>
                <div style={{fontFamily:C.sans, fontSize:13.5, color:C.ink2, marginTop:2}}>Yine de özgeçmişinizi gönderin — sizinle tanışırız.</div>
              </div>
              <a style={{fontFamily:C.sans, fontSize:13.5, fontWeight:600, color:C.ink, padding:'10px 18px', background:C.bg, borderRadius:999, border:`1px solid ${C.rule}`, cursor:'pointer'}}>Başvur →</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Contact ─────────────────────────────────────────────────
  function Contact() {
    const [f, setF] = useState({name:'', email:'', company:'', brief:''});
    const [sent, setSent] = useState(false);
    return (
      <section id="iletisim" style={{padding:'96px 40px', background:C.ink, color:C.bg}}>
        <div style={{maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'start'}}>
          <div>
            <div style={{fontFamily:C.sans, fontSize:13, fontWeight:600, color:C.indigoSoft, letterSpacing:'0.04em', textTransform:'uppercase'}}>İletişim</div>
            <h2 style={{fontFamily:C.sans, fontSize:60, fontWeight:700, lineHeight:1.02, letterSpacing:'-0.03em', color:C.bg, margin:'14px 0 0'}}>
              Bir <span style={{color:C.indigoSoft}}>proje</span> mi düşünüyorsunuz?
            </h2>
            <p style={{fontFamily:C.sans, fontSize:17, lineHeight:1.55, color:'rgba(247,245,240,0.75)', margin:'22px 0 32px', maxWidth:460}}>
              Kısa bir brief bırakın; 24 saat içinde size özel geri dönelim. Her talep ekibimizde doğrudan bir ürün yöneticisine gider.
            </p>
            <div style={{display:'grid', gap:22}}>
              {[
                {k:'E-posta', v:'merhaba@i-group.com.tr'},
                {k:'Telefon', v:'+90 212 000 00 00'},
                {k:'Ofis', v:'Maslak No.1 Plaza, Sarıyer / İstanbul'},
                {k:'Çalışma saatleri', v:'Pazartesi – Cuma · 09:30 – 18:30'},
              ].map(x=>(
                <div key={x.k}>
                  <div style={{fontFamily:C.sans, fontSize:12, fontWeight:600, color:C.indigoSoft, letterSpacing:'0.06em', textTransform:'uppercase'}}>{x.k}</div>
                  <div style={{fontFamily:C.sans, fontSize:19, fontWeight:500, color:C.bg, marginTop:4}}>{x.v}</div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={e=>{e.preventDefault(); setSent(true);}} style={{
            background:'rgba(247,245,240,0.06)', border:'1px solid rgba(247,245,240,0.14)',
            borderRadius:16, padding:32,
          }}>
            <div style={{fontFamily:C.sans, fontSize:21, fontWeight:600, letterSpacing:'-0.02em', color:C.bg, marginBottom:20}}>Proje briefi</div>
            {[
              {k:'name', label:'Ad soyad', ph:'Ayşe Demir'},
              {k:'email', label:'E-posta', ph:'ayse@sirket.com'},
              {k:'company', label:'Şirket', ph:'Şirket / marka adı'},
            ].map(fl=>(
              <label key={fl.k} style={{display:'block', marginBottom:16}}>
                <div style={{fontFamily:C.sans, fontSize:12, fontWeight:600, color:'rgba(247,245,240,0.7)', marginBottom:6, letterSpacing:'0.02em'}}>{fl.label}</div>
                <input
                  value={f[fl.k]} onChange={e=>setF({...f,[fl.k]:e.target.value})}
                  placeholder={fl.ph}
                  style={{
                    width:'100%', padding:'14px 16px',
                    background:'rgba(17,17,24,0.4)', border:'1px solid rgba(247,245,240,0.14)',
                    borderRadius:10, color:C.bg, fontFamily:C.sans, fontSize:15, outline:'none',
                  }}
                />
              </label>
            ))}
            <label style={{display:'block', marginBottom:22}}>
              <div style={{fontFamily:C.sans, fontSize:12, fontWeight:600, color:'rgba(247,245,240,0.7)', marginBottom:6}}>Kısaca projeniz</div>
              <textarea
                value={f.brief} onChange={e=>setF({...f, brief:e.target.value})}
                placeholder="Nasıl bir şey kurmak istersiniz? Hangi sektöre hitap ediyor?"
                rows={5}
                style={{
                  width:'100%', padding:'14px 16px',
                  background:'rgba(17,17,24,0.4)', border:'1px solid rgba(247,245,240,0.14)',
                  borderRadius:10, color:C.bg, fontFamily:C.sans, fontSize:15, outline:'none', resize:'none',
                }}
              />
            </label>
            <button type="submit" style={{
              width:'100%', padding:'16px 20px',
              background: sent ? '#16a34a' : `linear-gradient(135deg, ${C.indigoSoft}, ${C.violet})`,
              color:'#fff', border:'none', borderRadius:10, cursor:'pointer',
              fontFamily:C.sans, fontSize:15, fontWeight:600, letterSpacing:'0.01em',
              transition:'.2s',
            }}>{sent ? '✓ Briefinizi aldık — 24 saat içinde döneceğiz' : 'Briefi gönder →'}</button>
            <div style={{fontFamily:C.sans, fontSize:12, color:'rgba(247,245,240,0.55)', marginTop:14, textAlign:'center'}}>
              Paylaştığınız bilgiler yalnızca bu talep için kullanılır.
            </div>
          </form>
        </div>
      </section>
    );
  }

  function Footer() {
    return (
      <footer style={{padding:'56px 40px 36px', background:'#0A0A10', color:C.bg}}>
        <div style={{maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, paddingBottom:36, borderBottom:'1px solid rgba(247,245,240,0.12)'}}>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:28, height:28, borderRadius:8, background:`linear-gradient(135deg, ${C.indigoSoft}, ${C.violet})`}}/>
                <div style={{fontFamily:C.sans, fontSize:20, fontWeight:700, letterSpacing:'-0.02em', color:C.bg}}>i-group</div>
              </div>
              <div style={{fontFamily:C.sans, fontSize:14, color:'rgba(247,245,240,0.65)', marginTop:14, maxWidth:380, lineHeight:1.55}}>
                İstanbul merkezli ürün stüdyosu. Eczane, kozmetik, B2B ve kurumsal yazılım için uçtan uca ürün geliştirir ve işletir.
              </div>
            </div>
            {[
              {h:'Şirket', l:['Hakkımızda','Ekip','Kariyer','Basın']},
              {h:'Ürünler', l:['i-eczane','i-depo','i-kozmo','i-hesap','i-kira']},
              {h:'İletişim', l:['merhaba@i-group.com.tr','+90 212 000 00 00','Maslak, İstanbul','LinkedIn']},
            ].map(col=>(
              <div key={col.h}>
                <div style={{fontFamily:C.sans, fontSize:12.5, fontWeight:600, color:'rgba(247,245,240,0.5)', letterSpacing:'0.06em', textTransform:'uppercase'}}>{col.h}</div>
                <ul style={{listStyle:'none', padding:0, margin:'16px 0 0', fontFamily:C.sans, fontSize:14, lineHeight:2, color:'rgba(247,245,240,0.88)'}}>
                  {col.l.map(x=><li key={x}>{x}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{marginTop:24, display:'flex', justifyContent:'space-between', fontFamily:C.sans, fontSize:12.5, color:'rgba(247,245,240,0.5)'}}>
            <span>© 2026 i-group Yazılım A.Ş.</span>
            <span>KVKK · Gizlilik · Çerezler</span>
          </div>
        </div>
      </footer>
    );
  }

  function SwissSite() {
    return (
      <div style={{background:C.bg, color:C.ink, fontFamily:C.sans, overflow:'hidden'}}>
        <Nav/>
        <Hero/>
        <About/>
        <Projects/>
        <Sectors/>
        <Clients/>
        <Blog/>
        <Careers/>
        <Contact/>
        <Footer/>
      </div>
    );
  }

  window.SwissSite = SwissSite;
})();
