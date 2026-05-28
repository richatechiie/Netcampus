// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import Link from 'next/link'
// import {
//   Network, Shield, Activity, Bell, Ticket, BarChart3,
//   Users, ChevronRight, Github, ArrowRight, Wifi,
//   Server, CheckCircle, Zap, Lock, Clock, Globe,
//   AlertCircle, Monitor, Cpu, Radio
// } from 'lucide-react'

// export default function HomePage() {
//   const [scrolled, setScrolled] = useState(false)
//   const [activeDevice, setActiveDevice] = useState(0)

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20)
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   // Rotate active device for animation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveDevice(prev => (prev + 1) % 4)
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   const devices = [
//     { name: 'Core Router 1', ip: '8.8.8.8', status: 'online', latency: '24ms', type: 'Router' },
//     { name: 'Switch Lab A', ip: '1.1.1.1', status: 'online', latency: '2ms', type: 'Switch' },
//     { name: 'AP Library', ip: '9.9.9.9', status: 'online', latency: '18ms', type: 'Access Point' },
//     { name: 'Web Server', ip: '208.67.222.222', status: 'offline', latency: '--', type: 'Server' },
//   ]

//   return (
//     <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

//       {/* Navbar */}
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur border-b border-white/10' : 'bg-transparent'
//       }`}>
//         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
//               <Network className="h-5 w-5 text-white" />
//             </div>
//             <span className="font-bold text-lg text-white">NetCampus</span>
//           </div>

//           <div className="hidden md:flex items-center gap-8">
//             {['Features', 'How it works', 'About', 'Team'].map((item) => (
              
//                 key={item}
//                 href={`#${item.toLowerCase().replace(' ', '-')}`}
//                 className="text-sm text-white/60 hover:text-white transition-colors"
//               >
//                 {item}
//               </a>
//             ))}
//           </div>

//           <div className="flex items-center gap-3">
//             <Link
//               href="/login"
//               className="text-sm text-white/60 hover:text-white transition-colors"
//             >
//               Sign in
//             </Link>
//             <Link
//               href="/register"
//               className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-500 transition-colors"
//             >
//               Get Started
//               <ChevronRight className="h-4 w-4" />
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* ── HERO ── */}
//       <section className="min-h-screen flex items-center pt-16 px-6 relative overflow-hidden">

//         {/* Background effects */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/10 pointer-events-none" />
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

//         {/* Grid pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.03] pointer-events-none"
//           style={{
//             backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
//             backgroundSize: '60px 60px',
//           }}
//         />

//         <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

//           {/* Left — Text */}
//           <div className="relative z-10">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 mb-8">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
//               </span>
//               Real-time Network Monitoring Platform
//             </div>

//             {/* Headline */}
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
//               Monitor
//               <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//                 smarter.
//               </span>
//               Respond
//               <span className="block bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
//                 faster.
//               </span>
//             </h1>

//             <p className="text-lg text-white/60 max-w-lg mb-10 leading-relaxed">
//               A unified platform for campus network monitoring, IT helpdesk
//               management, and real-time infrastructure visibility — built
//               for educational institutions.
//             </p>

//             {/* CTA */}
//             <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
//               <Link
//                 href="/register"
//                 className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-7 py-3.5 text-base font-semibold hover:bg-blue-500 transition-colors"
//               >
//                 Start Monitoring Free
//                 <ArrowRight className="h-5 w-5" />
//               </Link>
//               <Link
//                 href="/login"
//                 className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 text-white px-7 py-3.5 text-base font-semibold hover:bg-white/10 transition-colors"
//               >
//                 View Dashboard
//               </Link>
//             </div>

//             {/* Stats */}
//             <div className="flex items-center gap-8">
//               {[
//                 { value: '30s', label: 'Ping interval' },
//                 { value: '500+', label: 'Devices' },
//                 { value: '99.5%', label: 'Uptime target' },
//               ].map((stat, i) => (
//                 <div key={stat.label}>
//                   <p className="text-2xl font-bold text-white">{stat.value}</p>
//                   <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right — Dashboard mockup */}
//           <div className="relative z-10 hidden lg:block">
//             {/* Outer glow */}
//             <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-2xl" />

//             {/* Dashboard card */}
//             <div className="relative rounded-2xl border border-white/10 bg-[#111118] overflow-hidden shadow-2xl">

//               {/* Topbar */}
//               <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#0d0d14]">
//                 <div className="h-3 w-3 rounded-full bg-red-500/80" />
//                 <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
//                 <div className="h-3 w-3 rounded-full bg-green-500/80" />
//                 <div className="flex-1 mx-4">
//                   <div className="h-5 rounded-md bg-white/5 flex items-center px-3">
//                     <span className="text-xs text-white/30">localhost:3000/dashboard</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Dashboard content */}
//               <div className="p-4">

//                 {/* Header row */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <p className="text-xs text-white/40">Welcome back,</p>
//                     <p className="text-sm font-semibold">Admin User</p>
//                   </div>
//                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
//                     <span className="relative flex h-1.5 w-1.5">
//                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
//                       <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
//                     </span>
//                     <span className="text-xs text-green-400">Live</span>
//                   </div>
//                 </div>

//                 {/* Stats cards */}
//                 <div className="grid grid-cols-4 gap-2 mb-4">
//                   {[
//                     { label: 'Devices', value: '8', color: 'text-blue-400' },
//                     { label: 'Uptime', value: '88%', color: 'text-green-400' },
//                     { label: 'Alerts', value: '17', color: 'text-red-400' },
//                     { label: 'Tickets', value: '7', color: 'text-yellow-400' },
//                   ].map((stat) => (
//                     <div key={stat.label} className="rounded-lg bg-white/5 border border-white/5 p-2.5">
//                       <p className="text-xs text-white/40">{stat.label}</p>
//                       <p className={`text-lg font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Latency graph mockup */}
//                 <div className="rounded-lg bg-white/5 border border-white/5 p-3 mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs font-medium text-white/60">Live Latency Monitor</p>
//                     <div className="flex items-center gap-1">
//                       <span className="relative flex h-1.5 w-1.5">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
//                         <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
//                       </span>
//                       <span className="text-xs text-green-400">Live</span>
//                     </div>
//                   </div>

//                   {/* Fake graph bars */}
//                   <div className="flex items-end gap-1 h-12">
//                     {[20, 35, 28, 42, 31, 38, 25, 44, 32, 29, 41, 35, 28, 38, 45, 30, 42, 35, 28, 40].map((h, i) => (
//                       <div
//                         key={i}
//                         className="flex-1 rounded-sm bg-gradient-to-t from-blue-600 to-blue-400 opacity-70"
//                         style={{ height: `${h}%` }}
//                       />
//                     ))}
//                   </div>

//                   {/* Device badges */}
//                   <div className="flex gap-2 mt-2">
//                     {['Google DNS', 'Switch Lab A', 'Core Router'].map((name, i) => (
//                       <div key={name} className="flex items-center gap-1">
//                         <div className={`h-1.5 w-1.5 rounded-full ${
//                           i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-green-400' : 'bg-yellow-400'
//                         }`} />
//                         <span className="text-xs text-white/30">{name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Device list */}
//                 <div className="rounded-lg bg-white/5 border border-white/5 p-3">
//                   <p className="text-xs font-medium text-white/60 mb-2">Network Devices</p>
//                   <div className="space-y-1.5">
//                     {devices.map((device, idx) => (
//                       <div
//                         key={device.name}
//                         className={`flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
//                           activeDevice === idx ? 'bg-white/10' : 'hover:bg-white/5'
//                         }`}
//                       >
//                         <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
//                           device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
//                         }`} />
//                         <span className="text-xs text-white/70 flex-1 truncate">{device.name}</span>
//                         <span className="text-xs text-white/30 font-mono">{device.latency}</span>
//                         <span className={`text-xs px-1.5 py-0.5 rounded-full ${
//                           device.status === 'online'
//                             ? 'bg-green-500/10 text-green-400'
//                             : 'bg-red-500/10 text-red-400'
//                         }`}>
//                           {device.status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* Floating alert card */}
//             <div className="absolute -bottom-4 -left-8 rounded-xl border border-white/10 bg-[#111118] p-3 shadow-xl w-52">
//               <div className="flex items-center gap-2 mb-1">
//                 <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
//                   <AlertCircle className="h-3.5 w-3.5 text-red-400" />
//                 </div>
//                 <span className="text-xs font-medium text-white">Device Offline</span>
//               </div>
//               <p className="text-xs text-white/40">Web Server is offline</p>
//               <div className="mt-2 flex items-center gap-1">
//                 <span className="text-xs text-red-400 font-medium">Critical</span>
//                 <span className="text-xs text-white/20">· just now</span>
//               </div>
//             </div>

//             {/* Floating uptime card */}
//             <div className="absolute -top-4 -right-6 rounded-xl border border-white/10 bg-[#111118] p-3 shadow-xl w-44">
//               <p className="text-xs text-white/40 mb-1">Network Uptime</p>
//               <p className="text-2xl font-bold text-green-400">88%</p>
//               <div className="mt-1.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
//                 <div className="h-full w-[88%] bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ── TRUSTED BY / STATS BANNER ── */}
//       <section className="py-10 border-y border-white/5 bg-white/[0.02]">
//         <div className="max-w-7xl mx-auto px-6">
//           <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-6">
//             Built for campus IT teams
//           </p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//             {[
//               { icon: Server, label: 'Devices Monitored', value: '500+' },
//               { icon: Activity, label: 'Ping Interval', value: '30 sec' },
//               { icon: Ticket, label: 'Ticket Workflow', value: '3 Roles' },
//               { icon: Bell, label: 'Alert Delivery', value: '< 500ms' },
//             ].map((item) => (
//               <div key={item.label} className="flex flex-col items-center gap-2">
//                 <item.icon className="h-5 w-5 text-blue-400" />
//                 <p className="text-xl font-bold text-white">{item.value}</p>
//                 <p className="text-xs text-white/30">{item.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── FEATURES ── */}
//       <section id="features" className="py-24 px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
//               Features
//             </p>
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Everything IT needs in one place
//             </h2>
//             <p className="text-white/50 text-lg max-w-2xl mx-auto">
//               Built specifically for campus environments where network
//               reliability directly affects learning and productivity.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[
//               {
//                 icon: Activity,
//                 color: 'text-blue-400',
//                 bg: 'bg-blue-500/10',
//                 border: 'border-blue-500/20',
//                 title: 'Real-time Monitoring',
//                 description: 'Automatic ping-based device monitoring every 30 seconds. Instantly know when any device goes offline — before users report it.',
//               },
//               {
//                 icon: Network,
//                 color: 'text-purple-400',
//                 bg: 'bg-purple-500/10',
//                 border: 'border-purple-500/20',
//                 title: 'Network Topology Map',
//                 description: 'Interactive D3.js force-directed graph showing all devices and connections. Drag, zoom, and click to inspect any node.',
//               },
//               {
//                 icon: Bell,
//                 color: 'text-red-400',
//                 bg: 'bg-red-500/10',
//                 border: 'border-red-500/20',
//                 title: 'Instant Alert System',
//                 description: 'Socket.io real-time alerts with browser push notifications and email. Critical alerts stay until acknowledged.',
//               },
//               {
//                 icon: Ticket,
//                 color: 'text-green-400',
//                 bg: 'bg-green-500/10',
//                 border: 'border-green-500/20',
//                 title: 'IT Helpdesk Ticketing',
//                 description: 'Students raise tickets, IT staff track and resolve them. Priority queuing, assignment, and resolution notes.',
//               },
//               {
//                 icon: BarChart3,
//                 color: 'text-yellow-400',
//                 bg: 'bg-yellow-500/10',
//                 border: 'border-yellow-500/20',
//                 title: 'Analytics Dashboard',
//                 description: 'Device uptime charts, alert frequency trends, ticket resolution stats — powered by MongoDB aggregation pipelines.',
//               },
//               {
//                 icon: Shield,
//                 color: 'text-cyan-400',
//                 bg: 'bg-cyan-500/10',
//                 border: 'border-cyan-500/20',
//                 title: 'Role-based Access',
//                 description: 'Three distinct portals for Admin, IT Staff, and Students. JWT authentication with protected routes and role guards.',
//               },
//             ].map((feature) => (
//               <div
//                 key={feature.title}
//                 className={`rounded-2xl border ${feature.border} bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-colors group`}
//               >
//                 <div className={`h-11 w-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
//                   <feature.icon className={`h-5 w-5 ${feature.color}`} />
//                 </div>
//                 <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
//                 <p className="text-white/40 text-sm leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ── */}
//       <section id="how-it-works" className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-16">
//             <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
//               How it works
//             </p>
//             <h2 className="text-4xl font-bold text-white mb-4">
//               From setup to monitoring in minutes
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { step: '01', icon: Users, title: 'Create account', description: 'Register as Admin, IT Staff, or Student. Each role gets a customised dashboard with relevant permissions.' },
//               { step: '02', icon: Cpu, title: 'Add your devices', description: 'Register routers, switches, access points, and servers with their IP addresses. Monitoring starts immediately.' },
//               { step: '03', icon: Radio, title: 'Monitor live', description: 'The system pings every device every 30 seconds. Status changes trigger instant socket alerts to all dashboards.' },
//               { step: '04', icon: CheckCircle, title: 'Resolve and improve', description: 'IT staff acknowledge alerts, resolve tickets, and track metrics. Analytics guide infrastructure decisions.' },
//             ].map((item) => (
//               <div
//                 key={item.step}
//                 className="flex gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-colors"
//               >
//                 <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
//                   <span className="text-blue-400 font-bold text-sm">{item.step}</span>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 mb-1.5">
//                     <item.icon className="h-4 w-4 text-blue-400" />
//                     <h3 className="font-semibold text-white">{item.title}</h3>
//                   </div>
//                   <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── TECH STACK ── */}
//       <section className="py-24 px-6">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-16">
//             <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
//               Tech Stack
//             </p>
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Built with modern technology
//             </h2>
//           </div>

//           <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
//             {[
//               { name: 'MongoDB', color: 'border-green-500/30 text-green-400 bg-green-500/5' },
//               { name: 'Express.js', color: 'border-white/10 text-white/60 bg-white/5' },
//               { name: 'React', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' },
//               { name: 'Node.js', color: 'border-green-500/30 text-green-300 bg-green-500/5' },
//               { name: 'Next.js', color: 'border-white/20 text-white bg-white/5' },
//               { name: 'Socket.io', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
//               { name: 'Redis', color: 'border-red-500/30 text-red-400 bg-red-500/5' },
//               { name: 'D3.js', color: 'border-orange-500/30 text-orange-400 bg-orange-500/5' },
//               { name: 'BullMQ', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5' },
//               { name: 'JWT', color: 'border-pink-500/30 text-pink-400 bg-pink-500/5' },
//               { name: 'Tailwind', color: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5' },
//               { name: 'CCNA', color: 'border-blue-600/30 text-blue-300 bg-blue-600/5' },
//             ].map((tech) => (
//               <div
//                 key={tech.name}
//                 className={`rounded-xl border px-3 py-2.5 text-center ${tech.color}`}
//               >
//                 <p className="font-semibold text-xs">{tech.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── ABOUT ── */}
//       <section id="about" className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
//         <div className="max-w-5xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
//                 About
//               </p>
//               <h2 className="text-4xl font-bold text-white mb-6">
//                 Why we built NetCampus
//               </h2>
//               <div className="space-y-4 text-white/50 leading-relaxed">
//                 <p>
//                   Most colleges rely on fragmented, manual tools to manage
//                   their network infrastructure. IT staff physically check
//                   devices. Students report WiFi issues verbally. There is
//                   no unified visibility into network health.
//                 </p>
//                 <p>
//                   NetCampus solves this by combining full-stack MERN
//                   development with real CCNA networking knowledge — building
//                   a platform that solves a genuine operational problem in
//                   educational institutions.
//                 </p>
//               </div>
//               <div className="grid grid-cols-2 gap-3 mt-8">
//                 {[
//                   { icon: Zap, label: 'Real-time monitoring' },
//                   { icon: Lock, label: 'Role-based access' },
//                   { icon: Clock, label: '30s ping interval' },
//                   { icon: Globe, label: 'Cloud deployed' },
//                 ].map((item) => (
//                   <div key={item.label} className="flex items-center gap-2">
//                     <item.icon className="h-4 w-4 text-blue-400 flex-shrink-0" />
//                     <span className="text-sm text-white/70">{item.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
//                 <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
//                   <AlertCircle className="h-4 w-4" />
//                   The Problem
//                 </h4>
//                 <ul className="space-y-2">
//                   {[
//                     'No real-time device visibility',
//                     'Manual physical checks required',
//                     'No formal issue reporting system',
//                     'Outdated or missing network diagrams',
//                     'Reactive instead of proactive IT',
//                   ].map((item) => (
//                     <li key={item} className="text-sm text-white/40 flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
//                 <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
//                   <CheckCircle className="h-4 w-4" />
//                   NetCampus Solution
//                 </h4>
//                 <ul className="space-y-2">
//                   {[
//                     'Live device status every 30 seconds',
//                     'Automated ping monitoring engine',
//                     'Structured IT helpdesk ticketing',
//                     'Interactive D3.js topology map',
//                     'Proactive alerts before users report',
//                   ].map((item) => (
//                     <li key={item} className="text-sm text-white/40 flex items-start gap-2">
//                       <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── TEAM ── */}
//       <section id="team" className="py-24 px-6">
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-16">
//             <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-3">
//               Team
//             </p>
//             <h2 className="text-4xl font-bold text-white mb-4">
//               Built by engineering students
//             </h2>
//             <p className="text-white/40 text-lg max-w-xl mx-auto">
//               6th semester Computer Engineering students combining
//               full-stack development with CCNA networking expertise.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {[
//               { name: 'Prabhjot Kaur', role: 'Full Stack Developer', skills: ['MERN', 'Socket.io', 'CCNA'], color: 'from-blue-600 to-blue-400', initials: 'PK' },
//               { name: 'Pavneet Kaur', role: 'Frontend Developer', skills: ['Next.js', 'Tailwind', 'D3.js'], color: 'from-purple-600 to-purple-400', initials: 'PK' },
//               { name: 'Richa', role: 'Backend Developer', skills: ['Node.js', 'MongoDB', 'Redis'], color: 'from-green-600 to-green-400', initials: 'R' },
//               { name: 'Mannat Virk', role: 'Backend Developer', skills: ['Node.js', 'Express', 'JWT'], color: 'from-orange-600 to-orange-400', initials: 'MV' },
//             ].map((member) => (
//               <div
//                 key={member.name}
//                 className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center hover:bg-white/[0.06] transition-colors"
//               >
//                 <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-3`}>
//                   <span className="text-white font-bold">{member.initials}</span>
//                 </div>
//                 <h3 className="font-semibold text-white">{member.name}</h3>
//                 <p className="text-white/40 text-xs mt-0.5">{member.role}</p>
//                 <div className="flex flex-wrap justify-center gap-1.5 mt-3">
//                   {member.skills.map((skill) => (
//                     <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
//             <p className="text-white/30 text-sm">
//               6th Semester · Computer Engineering · Academic Year 2025–2026
//             </p>
//             <p className="text-white font-semibold mt-1">Your College Name Here</p>
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="py-24 px-6 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none" />
//         <div className="absolute inset-0"
//           style={{
//             backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
//             backgroundSize: '60px 60px',
//           }}
//         />
//         <div className="max-w-3xl mx-auto text-center relative z-10">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Ready to monitor your
//             <span className="block text-blue-400">campus network?</span>
//           </h2>
//           <p className="text-white/50 text-lg mb-10">
//             Get started in minutes. Add your devices and the monitoring
//             engine takes over automatically.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link
//               href="/register"
//               className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-8 py-3.5 text-base font-semibold hover:bg-blue-500 transition-colors"
//             >
//               Create Free Account
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//             <Link
//               href="/login"
//               className="rounded-xl border border-white/20 bg-white/5 text-white px-8 py-3.5 text-base font-semibold hover:bg-white/10 transition-colors"
//             >
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer className="border-t border-white/5 py-10 px-6">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
//           <div className="flex items-center gap-2.5">
//             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
//               <Network className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <p className="font-bold text-white">NetCampus</p>
//               <p className="text-xs text-white/30">Smart Network & Campus Management</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-6 text-sm text-white/30">
//             {['Features', 'About', 'Team'].map((item) => (
//               <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
//                 {item}
//               </a>
//             ))}
//             <Link href="/login" className="hover:text-white transition-colors">Login</Link>
//           </div>

//           <div className="flex items-center gap-3">
            
//               href="https://github.com/richatechiie/Netcampus"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
//             >
//               <Github className="h-4 w-4 text-white/50" />
//             </a>
//             <p className="text-xs text-white/20">© 2026 NetCampus. BE Project.</p>
//           </div>
//         </div>
//       </footer>

//     </div>
//   )
// }