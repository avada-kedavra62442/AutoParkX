import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
ChevronDown,
ArrowRight,
Play,
Mail,
User,
MessageSquare,
Cpu,
Zap,
Radio,
Navigation,
Layers,
Clock,
Wind,
TrendingDown,
Building2,
Check,
Activity,
Shield,
Settings,
MapPin,
Target,
BarChart3,
Lock,
Eye,
EyeOff,
CalendarCheck
} from "lucide-react";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";

const COLORS = {
  bg: "#050A14", bgSurface: "#07101E", bgCard: "#0A1628",
  blue: "#3D7EFF", purple: "#7C3AED", cyan: "#06B6D4",
  green: "#10B981", amber: "#F59E0B", red: "#EF4444",
  textPrimary: "#EEF2FF", textMuted: "#7B93B8", textDim: "#4A607E"
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${COLORS.bg}; color: ${COLORS.textPrimary}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
  .disp { font-family: 'Space Grotesk', sans-serif; }
  .gtext { background: linear-gradient(135deg, #3D7EFF 0%, #7C3AED 55%, #06B6D4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gborder { border: 1px solid transparent; background-clip: padding-box; outline: 1px solid rgba(61,126,255,0.2); outline-offset: -1px; }
  section { scroll-margin-top: 72px; }
  input, textarea { font-family: 'Inter', sans-serif; }
  input:focus, textarea:focus { outline: 1px solid ${COLORS.blue}; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.blue}; border-radius: 10px; }

  @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes gridScroll { 0%{background-position:0 0} 100%{background-position:0 60px} }
  @keyframes blinkDot { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes slideUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scanLine { 0%{top:0%} 100%{top:100%} }
  @keyframes orbitRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(61,126,255,0.4)} 50%{box-shadow:0 0 0 12px rgba(61,126,255,0)} }
  @keyframes progressBar { from{width:0} to{width:var(--target-w)} }
  @keyframes countUp { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

  .float-anim { animation: floatY 5s ease-in-out infinite; }
  .blink { animation: blinkDot 1.5s ease-in-out infinite; }
  .slide-up { animation: slideUp 0.8s ease-out forwards; }
  .orbit { animation: orbitRing 12s linear infinite; }
  .fade-in { animation: fadeIn 1s ease-out forwards; }
  .pulse-ring { animation: pulseRing 2.5s ease-in-out infinite; }

  .nav-link { cursor:pointer; transition:color 0.2s; font-size:14px; color:${COLORS.textMuted}; font-weight:500; }
  .nav-link:hover { color:${COLORS.blue}; }

  .btn-primary { background: linear-gradient(135deg, #3D7EFF, #7C3AED); border:none; color:#fff; font-weight:600; cursor:pointer; transition:all 0.25s; font-family:'Inter',sans-serif; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(61,126,255,0.4); }
  .btn-outline { border:1px solid rgba(61,126,255,0.45); background:transparent; color:${COLORS.textPrimary}; font-weight:600; cursor:pointer; transition:all 0.25s; font-family:'Inter',sans-serif; }
  .btn-outline:hover { border-color:${COLORS.blue}; background:rgba(61,126,255,0.1); transform:translateY(-2px); }

  .tech-card { transition:transform 0.3s, box-shadow 0.3s; }
  .tech-card:hover { transform:translateY(-8px); box-shadow:0 20px 48px rgba(61,126,255,0.15); }

  .slot-pill { transition:all 0.4s ease; }

  .section-label { font-size:11px; letter-spacing:0.18em; font-weight:700; text-transform:uppercase; }
  .hero-grid-bg { background-image: linear-gradient(rgba(61,126,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,126,255,0.07) 1px, transparent 1px); background-size:56px 56px; animation: gridScroll 6s linear infinite; }
  .scan-container { position:relative; overflow:hidden; }
  .scan-container::after { content:''; position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(61,126,255,0.7),transparent); animation:scanLine 4s linear infinite; pointer-events:none; }

  .roadmap-line { background:linear-gradient(180deg, #3D7EFF, #7C3AED, #06B6D4, #10B981); }
  .flow-connector { position:relative; }
  .flow-connector::before { content:''; position:absolute; left:50%; top:0; bottom:0; width:2px; background:linear-gradient(${COLORS.blue}, ${COLORS.purple}); transform:translateX(-50%); }

  @media (max-width:768px) {
    .nav-links-desktop { display:none !important; }
    .hero-title { font-size:52px !important; }
    .hero-sub { font-size:18px !important; }
    .two-col { grid-template-columns: 1fr !important; }
    .roadmap-alt { flex-direction:column !important; }
    .roadmap-card { width:100% !important; margin-left:0 !important; }
  }
`;

function Section({ id, children, bg = COLORS.bg, style = {} }) {
  return (
    <section id={id} style={{ padding: "110px 24px", background: bg, ...style }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionHeader({ label, title, labelColor = COLORS.blue, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 72 }}>
      <div className="section-label" style={{ color: labelColor, marginBottom: 14 }}>{label}</div>
      <h2 className="disp" style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.1 }}
        dangerouslySetInnerHTML={{ __html: title }} />
      {subtitle && <p style={{ color: COLORS.textMuted, marginTop: 16, fontSize: 17, maxWidth: 580, margin: "16px auto 0", lineHeight: 1.7 }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style = {}, className = "" }) {
  return (
    <div className={`gborder ${className}`} style={{ borderRadius: 16, background: COLORS.bgCard, padding: 28, ...style }}>
      {children}
    </div>
  );
}

function GradientBadge({ children, color = COLORS.blue }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: `1px solid ${color}44`, background: `${color}11`, marginBottom: 28 }}>
      <span className="blink" style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.08em" }}>{children}</span>
    </div>
  );
}

// ── HERO PARKING MINI-DASHBOARD ────────────────────────────────────────────────
function HeroDashboard({ slots, occupancy }) {
  return (
    <div className="float-anim" style={{ background: "rgba(10,22,40,0.92)", border: "1px solid rgba(61,126,255,0.3)", borderRadius: 20, padding: 22, backdropFilter: "blur(20px)", display: "inline-block", minWidth: 340 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, letterSpacing: "0.1em" }}>LIVE FACILITY MONITOR</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span className="blink" style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.green, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 700 }}>ONLINE</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {slots.map((occupied, i) => (
          <div key={i} className="slot-pill" style={{ padding: "10px 6px", borderRadius: 10, border: `1px solid ${occupied ? COLORS.red + "55" : COLORS.green + "55"}`, background: occupied ? `${COLORS.red}11` : `${COLORS.green}11`, textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 3 }}>{occupied ? "🚗" : "🅿️"}</div>
            <div style={{ fontSize: 10, color: occupied ? COLORS.red : COLORS.green, fontWeight: 700 }}>S-{i + 1} {occupied ? "TAKEN" : "FREE"}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textDim, marginBottom: 5 }}>
        <span>Occupancy</span><span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>{occupancy}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${occupancy}%`, borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.purple})`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function AutoParkX() {
  const socketRef = useRef(null);

useEffect(() => {
  socketRef.current = io("http://localhost:3000");

  socketRef.current.on("parkingUpdate", (data) => {
    const liveSlots = [
      Boolean(data.slot1),
      Boolean(data.slot2),
      Boolean(data.slot3),
      Boolean(data.slot4)
    ];

    setSlots(liveSlots);

    const occupied =
      liveSlots.filter(Boolean).length;

    setOccupancy(
      Math.round((occupied / 4) * 100)
    );
  });

  return () => {
    socketRef.current.disconnect();
  };
}, []);



const [showLogin,setShowLogin] = useState(false);

const [showRegister,setShowRegister] = useState(false);


const [booking,setBooking] = useState(null);






const [navScrolled, setNavScrolled] = useState(false);
  const [slots, setSlots] = useState([false, false, false, false]);
  const [selectedSlot,setSelectedSlot] = useState("");
  const [occupancy, setOccupancy] = useState(0);
  const [counters, setCounters] = useState({ time: 0, fuel: 0, congestion: 0, emissions: 0 });
  const [countersStarted, setCountersStarted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [showPassword,setShowPassword]=useState(false);
  const [formSent, setFormSent] = useState(false);
  const [user, setUser] = useState(null);

const [loginData, setLoginData] = useState({
  email:"",
  password:""
});

const [registerData, setRegisterData] = useState({
  name:"",
  email:"",
  password:""
});

const [bookingSlot, setBookingSlot] = useState("");
const [bookingMessage, setBookingMessage] = useState("");
const impactRef = useRef(null);
  
useEffect(() => {

    socket.on(
        "parkingUpdate",
        (data)=>{

            const liveSlots=[
                Boolean(data.slot1),
                Boolean(data.slot2),
                Boolean(data.slot3),
                Boolean(data.slot4)
            ];


            setSlots(liveSlots);


            const occupied =
            liveSlots.filter(Boolean).length;


            setOccupancy(
                Math.round(
                    (occupied/4)*100
                )
            );

        }
    );


    return ()=>{
        socket.off(
            "parkingUpdate"
        );
    };


}, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(()=>{

const savedUser = localStorage.getItem("user");

if(savedUser){

setUser(JSON.parse(savedUser));

}

},[]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !countersStarted) {
        setCountersStarted(true);
        const targets = { time: 85, fuel: 73, congestion: 60, emissions: 68 };
        let step = 0;
        const id = setInterval(() => {
          step++;
          const p = step / 60;
          const ease = 1 - Math.pow(1 - p, 3);
          setCounters({ time: Math.round(targets.time * ease), fuel: Math.round(targets.fuel * ease), congestion: Math.round(targets.congestion * ease), emissions: Math.round(targets.emissions * ease) });
          if (step >= 60) clearInterval(id);
        }, 2000 / 60);
      }
    }, { threshold: 0.3 });
    if (impactRef.current) obs.observe(impactRef.current);
    return () => obs.disconnect();
  }, [countersStarted]);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
const saveUser = (data) => {

  localStorage.setItem("user", JSON.stringify(data));

  localStorage.setItem("userId", data.userId);

  localStorage.setItem("email", data.email || "");

  setUser(data);

};

function emailValid(email){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}



function passwordStrong(password){

return (

password.length>=8 &&
/[A-Z]/.test(password) &&
/[0-9]/.test(password)

);

}
  const login = async()=>{

const res = await fetch(
"http://localhost:3000/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(loginData)
}
);

const data = await res.json();

if(data.success){

saveUser(data);

setShowLogin(false);

alert("Welcome " + data.name);

}
else{

alert("Invalid Login");

}

};



const register = async()=>{

if(!emailValid(registerData.email)){

alert("Enter valid email");

return;

}

if(!passwordStrong(registerData.password)){

alert(
"Password must contain:\n" +
"- 8 characters\n" +
"- 1 uppercase letter\n" +
"- 1 number"
);

return;

}

const res = await fetch(
"http://localhost:3000/register",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(registerData)
}
);

const data = await res.json();

if(data.success){

alert("Account Created");

setShowRegister(false);

}
else{

alert(data.message);

}

};



const bookSlot = async()=>{

if(!user){

alert("Login first");

return;

}

if(!bookingSlot){

alert("Select a slot first");

return;

}

if(!selectedSlot){

alert("Select a parking slot");

return;

}

const res = await fetch(
"http://localhost:3000/book-slot",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

userId:user.userId,

email:user.email,

slot:selectedSlot

})
}
);

const data = await res.json();
setBookingMessage(
`✅ ${bookingSlot.toUpperCase()} booked successfully`
);

if(data.success){

alert("✅ Slot booked");

}

};

  const techCards = [
    { icon: <Cpu size={26} />, title: "ESP32 Controller", desc: "Dual-core 240 MHz processor managing all autonomous logic, sensor fusion, and real-time navigation decisions.", color: COLORS.blue },
    { icon: <Zap size={26} />, title: "L298N Motor Driver", desc: "High-current H-bridge driver enabling precise bidirectional speed control for smooth, accurate maneuvering.", color: COLORS.purple },
    { icon: <Radio size={26} />, title: "6-Channel Line Sensor", desc: "Infrared sensor array achieving sub-millimeter path tracking with adaptive threshold calibration.", color: COLORS.cyan },
    { icon: <Navigation size={26} />, title: "MH-B IR Sensor", desc: "MH-B modules delivering proximity mapping for slot detection and real-time obstacle avoidance.", color: COLORS.green },
    { icon: <Activity size={26} />, title: "Autonomous Navigation", desc: "PID-controlled line following with dynamic junction recognition and intelligent path planning logic.", color: COLORS.amber },
    { icon: <Layers size={26} />, title: "Smart Parking Algorithms", desc: "Slot-occupancy matrix with first-fit allocation ensuring optimal throughput and space utilization.", color: "#EF4444" },
  ];

  const flowSteps = [
    { step: "01", title: "Vehicle Arrival", desc: "Driver enters the designated loading zone — no parking skills or app required.", icon: "🚗", color: COLORS.blue },
    { step: "02", title: "Loading Area Entry", desc: "Vehicle is positioned on the AutoPark X robotic platform via guided entry markers.", icon: "📍", color: COLORS.purple },
    { step: "03", title: "Robot Activation", desc: "The autonomous robot confirms vehicle load and initiates navigation sequence.", icon: "🤖", color: COLORS.cyan },
    { step: "04", title: "Path Navigation", desc: "6-channel IR sensors guide the robot along optimised facility routes with PID accuracy.", icon: "🛤️", color: COLORS.green },
    { step: "05", title: "Slot Detection", desc: "IR sensors scan adjacent spaces and identify the nearest available slot.", icon: "📡", color: COLORS.amber },
    { step: "06", title: "Parking Execution", desc: "Robot executes precise maneuver, confirms occupancy, and returns to loading area.", icon: "✅", color: COLORS.red },
  ];

  const archNodes = [
    { label: "User", sub: "Driver Interface", icon: "👤", color: COLORS.blue },
    { label: "Loading Area", sub: "Vehicle Entry Zone", icon: "📥", color: COLORS.purple },
    { label: "AutoPark X Robot", sub: "ESP32 Main Controller", icon: "🤖", color: COLORS.cyan },
    { label: "Line Tracking", sub: "6-Channel IR Array", icon: "〰️", color: COLORS.green },
    { label: "Junction Detection", sub: "Path Decision Logic", icon: "⚡", color: COLORS.amber },
    { label: "Slot Detection", sub: "MH-B IR Sensor", icon: "📡", color: "#EF4444" },
    { label: "Parking Execution", sub: "L298N Motor Control", icon: "✅", color: "#8B5CF6" },
  ];

  const impactCards = [
    { icon: <Clock size={22} />, stat: counters.time, label: "Parking Time Reduced", color: COLORS.blue },
    { icon: <Target size={22} />, stat: counters.fuel, label: "Fuel Consumption Cut", color: COLORS.purple },
    { icon: <TrendingDown size={22} />, stat: counters.congestion, label: "Less Traffic Congestion", color: COLORS.cyan },
    { icon: <Wind size={22} />, stat: counters.emissions, label: "CO₂ Emissions Reduced", color: COLORS.green },
  ];

  const sdgCards = [
    { num: "SDG 9", title: "Industry, Innovation\n& Infrastructure", icon: "🏗️", color: COLORS.amber, points: ["Breakthrough robotic systems", "Sustainable infrastructure", "Technology-led innovation"] },
    { num: "SDG 11", title: "Sustainable Cities\n& Communities", icon: "🏙️", color: COLORS.blue, points: ["Reduced urban congestion", "Efficient land utilisation", "Smart city integration"] },
    { num: "SDG 13", title: "Climate Action", icon: "🌍", color: COLORS.green, points: ["Reduced CO₂ emissions", "Lower fuel consumption", "Cleaner urban air quality"] },
  ];

  const teamMembers = [
  {
    name: "Prashuk Jain",
    role: "Team Lead",
    image: "/prashuk.jpg",
    desc: "Vision, strategy, and overall project direction."
  },
  {
    name: "Saatwik Choudhary",
    role: "Technical Lead",
    image: "/satwik.jpg",
    desc: "ESP32 firmware, navigation logic, and system software."
  },
  {
    name: "Aarav Krish",
    role: "Hardware Lead",
    image: "/aarav.jpg",
    desc: "Circuit design, sensor integration, and hardware build."
  },
  {
    name: "Haris Hussain",
    role: "Design & UX Lead",
    image: "/haris.jpg",
    desc: "Creative thinking, redesigning, and 3D modeling."
  },
  {
    name: "Somil Kataria",
    role: "Research & Documentation Lead",
    image: "/soumil.jpg",
    desc: "Technical documentation, research, and presentations."
  },

];
  const roadmap = [
    { phase: "Now", title: "Working Prototype", desc: "Line-following robot with slot detection and full autonomous parking.", status: "done" },
    { phase: "Q1 2026", title: "Computer Vision", desc: "Camera-based AI for vehicle detection and dynamic environment mapping.", status: "next" },
    { phase: "Q2 2026", title: "Mobile App", desc: "Real-time slot reservation, navigation, and parking status via smartphone.", status: "future" },
    { phase: "Q3 2026", title: "Cloud Dashboard", desc: "Centralised monitoring, analytics, and remote management across facilities.", status: "future" },
    { phase: "2027", title: "Multi-Robot Fleet", desc: "Coordinated swarm with intelligent task allocation and collision avoidance.", status: "future" },
    { phase: "2027", title: "Smart City Deploy", desc: "Full integration with city infrastructure, traffic systems, and mobility platforms.", status: "future" },
  ];

  return (
    
    <div style={{ fontFamily: "'Inter',sans-serif", background: COLORS.bg, color: COLORS.textPrimary, overflowX: "hidden" }}>
      <style>{css}</style>

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, padding: "0 32px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s", background: navScrolled ? "rgba(5,10,20,0.96)" : "transparent", backdropFilter: navScrolled ? "blur(20px)" : "none", borderBottom: navScrolled ? "1px solid rgba(61,126,255,0.15)" : "none" }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 20, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
          <span className="gtext">AutoPark</span><span style={{ color: COLORS.textPrimary }}> X</span>
        </div>
        <div className="nav-links-desktop" style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {[
["Problem","problem"],
["Solution","solution"],
["Technology","technology"],
["Dashboard","dashboard"],
["Login","login"],
["Impact","impact"],
["Team","team"],
["Roadmap","roadmap"]
].map(([l,id]) => (
            <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{l}</span>
          ))}
          <button className="btn-primary" onClick={() => scrollTo("contact")} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14 }}>Contact</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section id="hero" style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 80 }}>
        <div className="hero-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />
        <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 900, height: 700, background: "radial-gradient(ellipse, rgba(61,126,255,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 500, height: 500, background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* floating particles */}
        {[...Array(10)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width: i%3===0?6:4, height: i%3===0?6:4, borderRadius:"50%", background: i%2===0?COLORS.blue:COLORS.purple, left:`${8+i*9}%`, top:`${15+(i%4)*18}%`, animation:`floatY ${3+i*0.5}s ease-in-out ${i*0.35}s infinite`, opacity: 0.6 }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 20px", maxWidth: 960 }}>
          <GradientBadge>AUTONOMOUS SMART PARKING PLATFORM</GradientBadge>

          <h1 className="disp gtext" style={{ fontSize: "clamp(60px,12vw,128px)", fontWeight: 700, lineHeight: 0.95, letterSpacing: "-3px", marginBottom: 18 }}>
            AutoPark X
          </h1>
          <p className="disp" style={{ fontSize: "clamp(20px,3vw,30px)", color: COLORS.textMuted, fontWeight: 400, letterSpacing: "-0.4px", marginBottom: 22 }}>
            The Future of Autonomous Smart Parking
          </p>
          <p style={{ fontSize: "clamp(14px,1.5vw,18px)", color: COLORS.textDim, lineHeight: 1.75, maxWidth: 560, margin: "0 auto 44px" }}>
            An intelligent robotic parking platform that automatically detects available parking spaces and parks vehicles without driver intervention.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => scrollTo("demo")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, fontSize: 16 }}>
              <Play size={17} /> Watch Demo
            </button>
            <button className="btn-outline" onClick={() => scrollTo("technology")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, fontSize: 16 }}>
              Explore Technology <ArrowRight size={17} />
            </button>
          </div>

          {/*<div style={{ marginTop: 70, display: "flex", justifyContent: "center" }}>
            <HeroDashboard slots={slots} occupancy={occupancy} />
          </div>*/}
        </div>

        {/*<div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", cursor: "pointer", animation: "floatY 2s ease-in-out infinite" }} onClick={() => scrollTo("problem")}>
          <ChevronDown size={28} style={{ color: COLORS.textDim }} />
        </div>*/}
      </section>

      {/* ── PROBLEM ────────────────────────────────────── */}
      <Section id="problem" bg={COLORS.bgSurface}>
        <SectionHeader label="The Challenge" title='The <span class="gtext">Parking Crisis</span>' labelColor={COLORS.red} subtitle="Urban parking has some major problems. These are the numbers behind the problem AutoPark X is designed to solve." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {[
            { stat: "17 Min", label: "Wasted search time", desc: "Drivers often spend significant time searching for available parking spaces.", icon: "⏱️", c: COLORS.red },
            { stat: "30%", label: "Of city-centre traffic", desc: "Parking searches contribute to traffic congestion in busy city areas.", icon: "🚦", c: COLORS.amber },
            { stat: "1.4 L", label: "Fuel wasted per search", desc: "Each fruitless parking search burns more than a litre of fuel, adding cost and emissions.", icon: "⛽", c: COLORS.green },
            { stat: "700 M+", label: "Tons CO₂ annually", desc: "Parking-related traffic contributes hundreds of millions of tons of CO₂ every year.", icon: "🌍", c: COLORS.cyan },
            { stat: "78%", label: "Of drivers frustrated", desc: "More than three-quarters of drivers cite parking as their biggest urban mobility stressor.", icon: "😤", c: COLORS.blue },
            { stat: "NOTE", label: "Rough estimates", desc: "Values shown are conceptual estimates for prototype demonstration and require large-scale field testing for validation.", icon: "⚠️", c: COLORS.purple },
          ].map((item, i) => (
            <Card key={i} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 14, right: 14, fontSize: 30, opacity: 0.6 }}>{item.icon}</div>
              <div className="disp" style={{ fontSize: 50, fontWeight: 700, color: item.c, marginBottom: 6, lineHeight: 1 }}>{item.stat}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.65 }}>{item.desc}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── SOLUTION ───────────────────────────────────── */}
      <Section id="solution" bg={COLORS.bg}>
        <SectionHeader label="The Solution" title='How <span class="gtext">AutoPark X</span> Works' labelColor={COLORS.blue} />
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {flowSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div className="pulse-ring" style={{ width: 60, height: 60, borderRadius: "50%", background: `${step.color}18`, border: `2px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, zIndex: 1 }}>
                  {step.icon}
                </div>
                {i < flowSteps.length - 1 && (
                  <div style={{ width: 2, height: 56, background: `linear-gradient(${step.color}, ${flowSteps[i+1].color})` }} />
                )}
              </div>
              <Card style={{ flex: 1, marginBottom: i < flowSteps.length - 1 ? 0 : 0, marginTop: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <span style={{ fontSize: 11, color: step.color, fontWeight: 800, letterSpacing: "0.1em" }}>STEP {step.step}</span>
                  <span className="disp" style={{ fontSize: 18, fontWeight: 700 }}>{step.title}</span>
                </div>
                <p style={{ color: COLORS.textMuted, lineHeight: 1.65, fontSize: 14 }}>{step.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TECHNOLOGY ─────────────────────────────────── */}
      <Section id="technology" bg={COLORS.bgSurface}>
        <SectionHeader label="Under the Hood" title='Technology Behind <span class="gtext">AutoPark X</span>' labelColor={COLORS.purple} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))", gap: 22 }}>
          {techCards.map((card, i) => (
            <Card key={i} className="tech-card">
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `${card.color}18`, border: `1px solid ${card.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, marginBottom: 18 }}>
                {card.icon}
              </div>
              <h3 className="disp" style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{card.title}</h3>
              <p style={{ color: COLORS.textMuted, lineHeight: 1.7, fontSize: 14 }}>{card.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── LIVE DASHBOARD ─────────────────────────────── */}
      <Section id="dashboard" bg={COLORS.bg}>
        <SectionHeader label="Live Monitoring" title='Real-Time <span class="gtext">Parking Dashboard</span>' labelColor={COLORS.green} />
        <div className="scan-container" style={{ background: COLORS.bgCard, border: "1px solid rgba(61,126,255,0.25)", borderRadius: 20, overflow: "hidden", maxWidth: 900, margin: "0 auto" }}>
          {/* window chrome */}
          <div style={{ padding: "14px 22px", borderBottom: "1px solid rgba(61,126,255,0.18)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(61,126,255,0.04)" }}>
            <div style={{ display: "flex", gap: 7 }}>
              {["#EF4444","#F59E0B","#10B981"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              <span style={{ fontSize: 13, color: COLORS.textDim, marginLeft: 10, fontWeight: 500 }}>AutoPark X — Facility Management System</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="blink" style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.green, display: "inline-block" }} />
              <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 700 }}>LIVE</span>
            </div>
          </div>
          <div style={{ padding: 28 }}>
            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14, marginBottom: 24 }}>
              {[
                { l: "Total Slots", v: 4, c: COLORS.textPrimary },
                { l: "Occupied", v: slots.filter(Boolean).length, c: COLORS.red },
                { l: "Available", v: slots.filter(b=>!b).length, c: COLORS.green },
                { l: "Occupancy", v: `${occupancy}%`, c: COLORS.blue },
              ].map((s,i) => (
                <div key={i} style={{ background: "rgba(61,126,255,0.05)", border: "1px solid rgba(61,126,255,0.12)", borderRadius: 12, padding: "14px 16px" }}>
                  <div className="disp" style={{ fontSize: 28, fontWeight: 700, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Slot grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 14, marginBottom: 20 }}>
              {slots.map((occ, i) => (
                <div key={i} className="slot-pill" style={{ borderRadius: 12, padding: "18px 12px", border: `1px solid ${occ ? COLORS.red+"44" : COLORS.green+"44"}`, background: occ ? `${COLORS.red}0D` : `${COLORS.green}0D`, textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 7 }}>{occ ? "🚗" : "🅿️"}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 5 }}>Slot {i+1}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, background: occ ? `${COLORS.red}22` : `${COLORS.green}22` }}>
                    <span className="blink" style={{ width: 5, height: 5, borderRadius: "50%", background: occ ? COLORS.red : COLORS.green, display: "inline-block" }} />
                    <span style={{ fontSize: 10, color: occ ? COLORS.red : COLORS.green, fontWeight: 700 }}>{occ ? "OCCUPIED" : "AVAILABLE"}</span>
                  </div>
                </div>
              ))}
            </div>
            <Card>

<h3 className="disp">
Reserve Slot
</h3>


<select
value={bookingSlot}
onChange={
e=>setBookingSlot(e.target.value)
}
>

<option value="">
Choose Slot
</option>

<option
value="slot1"
disabled={slots[0]}
>
Slot 1 {slots[0] ? "(Occupied)" : ""}
</option>

<option
value="slot2"
disabled={slots[1]}
>
Slot 2 {slots[1] ? "(Occupied)" : ""}
</option>

<option
value="slot3"
disabled={slots[2]}
>
Slot 3 {slots[2] ? "(Occupied)" : ""}
</option>

<option
value="slot4"
disabled={slots[3]}
>
Slot 4 {slots[3] ? "(Occupied)" : ""}
</option>

</select>


<button
className="btn-primary"
onClick={bookSlot}
>
Book
</button>


<p>{bookingMessage}</p>


</Card>
            {/* Occupancy bar */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: COLORS.textDim }}>Overall Occupancy</span>
                <span style={{ color: COLORS.textPrimary, fontWeight: 700 }}>{occupancy}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${occupancy}%`, borderRadius: 4, background: `linear-gradient(90deg, ${occupancy>70?COLORS.red:occupancy>40?COLORS.amber:COLORS.green}, ${COLORS.blue})`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ARCHITECTURE ───────────────────────────────── */}
      <Section id="architecture" bg={COLORS.bgSurface}>
        <SectionHeader label="Engineering" title='System <span class="gtext">Architecture</span>' labelColor={COLORS.cyan} />
        <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {archNodes.map((node, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 12, border: `1px solid ${node.color}33`, background: `${node.color}0E`, width: `${100 - i*8}%`, maxWidth: 480, justifyContent: "flex-start" }}>
                <span style={{ fontSize: 22 }}>{node.icon}</span>
                <div>
                  <div className="disp" style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{node.label}</div>
                  <div style={{ fontSize: 12, color: node.color, fontWeight: 500 }}>{node.sub}</div>
                </div>
              </div>
              {i < archNodes.length - 1 && (
                <div style={{ width: 2, height: 32, background: `linear-gradient(${node.color}, ${archNodes[i+1].color})`, position: "relative" }}>
                  <div className="blink" style={{ width: 8, height: 8, borderRadius: "50%", background: archNodes[i+1].color, position: "absolute", left: -3, bottom: 0 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── IMPACT ─────────────────────────────────────── */}
      <Section id="impact" bg={COLORS.bg}>
        <div ref={impactRef}>
          <SectionHeader label="Making a Difference" title='Impact on <span class="gtext">Smart Cities</span>' labelColor={COLORS.green} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20, marginBottom: 52 }}>
            {impactCards.map((card, i) => (
              <Card key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${card.color}18`, border: `1px solid ${card.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, margin: "0 auto 14px" }}>
                  {card.icon}
                </div>
                <div className="disp" style={{ fontSize: 54, fontWeight: 700, color: card.color, lineHeight: 1 }}>
                  {card.stat}<span style={{ fontSize: 28 }}>%</span>
                </div>
                <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 10 }}>{card.label}</div>
              </Card>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
            {[
              { icon: "⚡", title: "Faster Parking Experience", desc: "From arrival to parked in under 2 minutes vs 17+ traditionally." },
              { icon: "🛢️", title: "Reduced Fuel Consumption", desc: "Eliminating parking searches cuts per-vehicle fuel waste significantly." },
              { icon: "🌿", title: "Lower Carbon Emissions", desc: "Less fuel burned means directly cleaner urban air quality." },
              { icon: "🚇", title: "Better Urban Mobility", desc: "Efficient parking infrastructure enables smoother city movement." },
              { icon: "📐", title: "Efficient Land Utilisation", desc: "Automated systems park up to 40% more vehicles in the same footprint." },
              { icon: "⚠️", title: "Rough estimates", desc: "Values shown are conceptual estimates for prototype demonstration and require large-scale field testing for validation." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: 18, borderRadius: 12, border: "1px solid rgba(61,126,255,0.1)", background: "rgba(61,126,255,0.03)" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SDGs ───────────────────────────────────────── */}
      <Section id="sdg" bg={COLORS.bgSurface}>
        <SectionHeader label="Global Goals" title='UN Sustainable <span class="gtext">Development Goals</span>' labelColor={COLORS.amber} subtitle="AutoPark X directly advances three United Nations Sustainable Development Goals." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {sdgCards.map((sdg, i) => (
            <div key={i} style={{ borderRadius: 20, border: `1px solid ${sdg.color}44`, background: `${sdg.color}0D`, padding: 30, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -10, fontSize: 80, opacity: 0.08 }}>{sdg.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: sdg.color, letterSpacing: "0.06em", marginBottom: 8 }}>{sdg.num}</div>
              <h3 className="disp" style={{ fontSize: 21, fontWeight: 700, marginBottom: 14, lineHeight: 1.3, whiteSpace: "pre-line" }}>{sdg.title}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sdg.points.map((p, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} style={{ color: sdg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: COLORS.textMuted }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TEAM ───────────────────────────────────────── */}
      <Section id="team" bg={COLORS.bg}>
        <SectionHeader label="The People" title='Meet <span class="gtext">Team AutoPark X</span>' labelColor={COLORS.purple} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22 }}>
          {teamMembers.map((m, i) => (
            <Card key={i} className="tech-card" style={{ textAlign: "center", padding: "36px 22px" }}>
              <img
                src={m.image}
                alt={m.name}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center 20%",
                  margin: "0 auto 18px",
                  display: "block",
                  border: "3px solid rgba(61,126,255,0.25)",
                  transition: "transform 0.3s ease",
                  transform: "scale(1.05)"
                }}
              />

        <div
          style={{
            fontSize: 12,
            color: COLORS.textDim,
            marginBottom: 5,
            fontWeight: 500
          }}
        >
          <h3>{m.name}</h3>
        </div>
              <h3 className="disp" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{m.role}</h3>
              <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65 }}>{m.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── ROADMAP ────────────────────────────────────── */}
      <Section id="roadmap" bg={COLORS.bgSurface}>
        <SectionHeader label="What's Next" title='Future <span class="gtext">Vision</span>' labelColor={COLORS.cyan} />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: `linear-gradient(${COLORS.blue},${COLORS.purple},${COLORS.cyan})`, transform: "translateX(-50%)" }} />
          {roadmap.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 24, marginBottom: 40, justifyContent: i%2===0?"flex-end":"flex-start", position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: 18, transform: "translateX(-50%)", zIndex: 2 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: item.status==="done"?COLORS.green:item.status==="next"?COLORS.blue:"#253550", border: `2px solid ${item.status==="done"?COLORS.green:item.status==="next"?COLORS.blue:"#3A4F6E"}`, boxShadow: item.status!=="future"?`0 0 10px ${item.status==="done"?COLORS.green:COLORS.blue}66`:"none" }} />
              </div>
              <div style={{ width: "calc(50% - 28px)", ...(i%2===0?{textAlign:"right"}:{marginLeft:"calc(50% + 28px)", textAlign:"left"}) }}>
                <Card style={{ display: "inline-block", width: "100%", textAlign: "left" }}>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: item.status==="done"?`${COLORS.green}22`:item.status==="next"?`${COLORS.blue}22`:"rgba(255,255,255,0.05)", color: item.status==="done"?COLORS.green:item.status==="next"?COLORS.blue:COLORS.textDim }}>
                      {item.status==="done"?"CURRENT":item.status==="next"?"UPCOMING":item.phase}
                    </span>
                  </div>
                  <h3 className="disp" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65 }}>{item.desc}</p>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── DEMO VIDEO ─────────────────────────────────── */}
      <Section id="demo" bg={COLORS.bg}>
        <SectionHeader label="Demo" title='See AutoPark X <span class="gtext">in Action</span>' labelColor={COLORS.blue} />
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(61,126,255,0.25)",
            background: COLORS.bgCard,
            boxShadow: "0 25px 80px rgba(61,126,255,0.18)",
            aspectRatio: "16 / 9"
          }}
        >
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(135deg, rgba(61,126,255,0.08), rgba(124,58,237,0.08))",
      pointerEvents: "none",
      zIndex: 1
    }}
  />

  <video
  controls
  preload="metadata"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "contain",
    background: "#000"
  }}
>
  <source src="/demo.mp4" type="video/mp4" />
</video>
</div>
      </Section>
{/* ── LOGIN ────────────────────────────────────── */}
<Section id="login" bg={COLORS.bg}>

<SectionHeader
label="Account"
title='Login <span class="gtext">& Booking</span>'
/>


<Card>

<h3 className="disp">
Login
</h3>


<input
placeholder="Email"
value={loginData.email}
onChange={
e=>setLoginData({
...loginData,
email:e.target.value
})
}
/>


<input
placeholder="Password"
type="password"
value={loginData.password}
onChange={
e=>setLoginData({
...loginData,
password:e.target.value
})
}
/>


<button
className="btn-primary"
onClick={login}
>
Login
</button>


<hr/>


<h3>
Register
</h3>


<input
placeholder="Name"
onChange={
e=>setRegisterData({
...registerData,
name:e.target.value
})
}
/>


<input
placeholder="Email"
onChange={
e=>setRegisterData({
...registerData,
email:e.target.value
})
}
/>


<input
placeholder="Password"
type="password"
onChange={
e=>setRegisterData({
...registerData,
password:e.target.value
})
}
/>


<button
className="btn-outline"
onClick={register}
>
Create Account
</button>


</Card>


</Section>

{/* ── CONTACT ────────────────────────────────────── */}

      {/* ── CONTACT ────────────────────────────────────── */}
      <Section id="contact" bg={COLORS.bgSurface}>
        <SectionHeader label="Get in Touch" title={`Let's Build the <span class="gtext">Future Together</span>`} labelColor={COLORS.blue} subtitle="Whether you're an investor, city planner, educator, or innovator — we'd love to hear from you." />
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <Card style={{ padding: 42 }}>
            {formSent ? (
  <div style={{ textAlign: "center", padding: "40px 0" }}>
  <div style={{ fontSize:48, marginBottom:16 }}>✅</div>

  <h3 
    className="disp"
    style={{ fontSize:22, fontWeight:700, marginBottom:10 }}
  >
    Message Sent!
  </h3>

  <p style={{ color: COLORS.textMuted }}>
    We'll get back to you as soon as possible.
    Thank you for your interest in AutoPark X.
  </p>

  <button
    className="btn-outline"
    onClick={() => {
      setFormSent(false);
      setFormData({
        name:"",
        email:"",
        message:""
      });
    }}
    style={{
      marginTop:24,
      padding:"12px 24px",
      borderRadius:10,
      fontSize:14
    }}
  >
    Send Another Response →
  </button>

</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { label: "Your Name", ph: "Alex Johnson", type: "text", field: "name", icon: <User size={15} /> },
                  { label: "Email Address", ph: "alex@example.com", type: "email", field: "email", icon: <Mail size={15} /> },
                ].map(inp => (
                  <div key={inp.field}>
                    <label style={{ fontSize: 13, color: COLORS.textMuted, display: "block", marginBottom: 7 }}>{inp.label}</label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: COLORS.textDim }}>{inp.icon}</div>
                      <input type={inp.type} placeholder={inp.ph} value={formData[inp.field]}
                        onChange={e => setFormData(p => ({ ...p, [inp.field]: e.target.value }))}
                        style={{ width: "100%", padding: "13px 13px 13px 40px", borderRadius: 10, border: "1px solid rgba(61,126,255,0.25)", background: "rgba(61,126,255,0.04)", color: COLORS.textPrimary, fontSize: 15 }} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 13, color: COLORS.textMuted, display: "block", marginBottom: 7 }}>Your Message</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 13, top: 13, color: COLORS.textDim }}><MessageSquare size={15} /></div>
                    <textarea placeholder="Tell us about your interest in AutoPark X..." rows={5} value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      style={{ width: "100%", padding: "13px 13px 13px 40px", borderRadius: 10, border: "1px solid rgba(61,126,255,0.25)", background: "rgba(61,126,255,0.04)", color: COLORS.textPrimary, fontSize: 15, resize: "vertical", fontFamily: "inherit" }} />
                  </div>
                </div>
                <button
  className="btn-primary"
  onClick={async () => {

    if (!formData.name || !formData.email) {
      alert("Please fill in your name and email.");
      return;
    }

    try {

const response = await fetch(
"http://localhost:3000/contact",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
name: formData.name,
email: formData.email,
subject: "AutoParkX Contact Form",
message: formData.message
})
}
);

if (!response.ok) {
throw new Error("Failed");
}

setFormSent(true);

    } catch (err) {
  console.error("CONTACT ERROR:", err);
  alert("Failed to send message.");
}
  }}
  style={{ padding: "15px", borderRadius: 10, fontSize: 16 }}
>
  Send Message →
</button>
              </div>
            )}
          </Card>
        </div>
      </Section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: "56px 24px 28px", background: "#030609", borderTop: "1px solid rgba(61,126,255,0.12)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 44, marginBottom: 44 }}>
            <div>
              <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                <span className="gtext">AutoPark</span> X
              </div>
              <p style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.7 }}>Driving the Future of Smart Parking — an autonomous robotic platform built for tomorrow's smart cities.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.12em", marginBottom: 16 }}>SECTIONS</div>
              {["Problem","Solution","Technology","Dashboard","Impact","Team","Roadmap","Contact"].map(item => (
                <div key={item} onClick={() => scrollTo(item.toLowerCase())} style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 8, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = COLORS.blue} onMouseLeave={e => e.target.style.color = COLORS.textDim}>
                  {item}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.12em", marginBottom: 16 }}>CONNECT</div>
<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
  {[
    {
      icon: <FaGithub size={19} />,
      link: "https://github.com/somilkataria345-beep/Team-C.V.-Raman/"
    },
    {
      icon: <FaXTwitter size={19} />,
      link: "https://x.com/PrashukJaictnx"
    },
    {
      icon: <FaLinkedin size={19} />,
      link: "https://linkedin.com/in/cv-raman-318209419"
    },
    {
  icon: <Mail size={19} />,
  link: "https://mail.google.com/mail/?view=cm&fs=1&to=cv.raman.official@gmail.com"
    }
  ].map((item, i) => (
    <a
      key={i}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "1px solid rgba(61,126,255,0.25)",
          background: "rgba(61,126,255,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.textDim,
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = COLORS.blue;
          e.currentTarget.style.borderColor = COLORS.blue;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = COLORS.textDim;
          e.currentTarget.style.borderColor = "rgba(61,126,255,0.25)";
        }}
      >
        {item.icon}
      </div>
    </a>
  ))}
</div>
              <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(61,126,255,0.15)", background: "rgba(61,126,255,0.04)" }}>
                <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 5 }}>BUILT WITH</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>ESP32 · L298N · IR Sensors · Ultrasonic · React · Tailwind</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(61,126,255,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13, color: COLORS.textDim }}>© 2025 AutoPark X. All rights reserved.</span>
            <span style={{ fontSize: 13, color: COLORS.textDim }}>🚗 Driving the Future of Smart Parking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
