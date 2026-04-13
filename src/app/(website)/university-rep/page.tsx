"use client";

import { useState } from "react";
import Container from "@/src/components/layouts/container";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { 
    Users, Award, Calendar, 
    CheckCircle2, Rocket, Globe,
    ArrowRight, GraduationCap, 
    Search, Sparkles, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function UniversityRepPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        university: "",
        year: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, this would send to an API
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, duration: 0.5 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-white min-h-screen font-inter pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[150px]" />
                </div>
                
                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold uppercase tracking-widest mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-600" />
                        Ambassador Program
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1] mb-8"
                    >
                        Represent the future of <br />
                        <span className="text-emerald-600">Dental Education.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
                    >
                        Join the DentiSpark Campus Ambassador program and lead the next generation of students at your university. 
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-lg shadow-xl shadow-slate-200" onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}>
                            Apply Now
                        </Button>
                        <Button variant="ghost" size="lg" className="h-16 px-10 rounded-2xl font-bold text-lg text-slate-600" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                            Learn More
                        </Button>
                    </motion.div>
                </Container>
            </div>

            {/* Program Benefits */}
            <div id="benefits" className="bg-[#fcfcfd] py-32">
                <Container>
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Why join our program?</h2>
                        <p className="text-slate-500 font-medium text-lg">Unmatched perks designed for the leaders of tomorrow.</p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { 
                                icon: <Award className="w-8 h-8" />, 
                                title: "CV & Experience", 
                                desc: "Gain valuable leadership and marketing experience that stands out on your residency applications.",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            { 
                                icon: <Globe className="w-8 h-8" />, 
                                title: "Global Network", 
                                desc: "Connect with top mentors, professionals, and fellow ambassadors from top dental schools worldwide.",
                                color: "bg-blue-50 text-blue-600"
                            },
                            { 
                                icon: <Rocket className="w-8 h-8" />, 
                                title: "Elite Rewards", 
                                desc: "Earn cash rewards, stipends, and performance-based bonuses based on campus growth.",
                                color: "bg-purple-50 text-purple-600"
                            },
                            { 
                                icon: <Sparkles className="w-8 h-8" />, 
                                title: "Free Access", 
                                desc: "Full complimentary access to the entire DentiSpark platform premium features for life.",
                                color: "bg-amber-50 text-amber-600"
                            }
                        ].map((benefit, i) => (
                            <motion.div 
                                key={i}
                                variants={itemVariants}
                                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className={`w-16 h-16 ${benefit.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{benefit.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>
            </div>

            {/* Responsibilities */}
            <div className="py-32">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                                What does a <br />
                                <span className="text-emerald-600 text-gradient bg-clip-text">Campus Rep do?</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                You are our direct link to the students. You&apos;ll lead initiatives, build community, and help us improve the platform based on real feedback.
                            </p>
                            
                            <div className="space-y-6 pt-4">
                                {[
                                    { title: "Campus Advocacy", desc: "Build excitement for DentiSpark at your dental or medical school." },
                                    { title: "Event Hosting", desc: "Organize workshops, mock interviews, and info sessions for students." },
                                    { title: "Social Impact", desc: "Share our mission and resources through your social channels." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-1">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-900 text-lg">{item.title}</h4>
                                            <p className="text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-[4rem] bg-slate-100 overflow-hidden shadow-2xl relative">
                                <img 
                                    src="/images/premium/mentor-banner.png" 
                                    alt="Ambassador interaction" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply" />
                            </div>
                            {/* Floating Stats Card */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-extrabold text-slate-900 leading-none">500+</p>
                                        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-1">Global Reps</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Container>
            </div>

            {/* Application Section */}
            <div id="apply-form" className="py-20 relative overflow-hidden">
                <Container>
                    <div className="bg-slate-950 rounded-[4rem] p-10 md:p-20 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none translate-x-1/2">
                            <div className="w-full h-full bg-emerald-500 rounded-full blur-[100px]" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.1]">
                                    Become a <br />
                                    <span className="text-emerald-500">Leader Today.</span>
                                </h2>
                                <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
                                    Ready to make an impact? Fill out the form and our program director will reach out to schedule an interview.
                                </p>
                                <div className="flex items-center gap-4 text-emerald-500 font-bold">
                                    <MessageSquare className="w-6 h-6" />
                                    <span>Typically responds within 24 hours</span>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-12">
                                {submitted ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-extrabold mb-4">Application Sent!</h3>
                                        <p className="text-slate-400 font-medium text-lg leading-relaxed">
                                            Thank you for expressing interest. Our team will review your application and get back to you shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
                                                <Input 
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-emerald-500 focus:bg-white/10 text-white font-medium"
                                                    required
                                                    value={formState.name}
                                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
                                                <Input 
                                                    type="email"
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-emerald-500 focus:bg-white/10 text-white font-medium"
                                                    required
                                                    value={formState.email}
                                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-4">University</label>
                                                <Input 
                                                    className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-emerald-500 focus:bg-white/10 text-white font-medium"
                                                    required
                                                    value={formState.university}
                                                    onChange={e => setFormState({...formState, university: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-4">Year of Study</label>
                                                <select 
                                                    className="w-full h-14 px-6 rounded-2xl bg-white/5 border-white/10 focus:border-emerald-500 focus:bg-white/10 text-white font-medium outline-none occurrence-none"
                                                    required
                                                    value={formState.year}
                                                    onChange={e => setFormState({...formState, year: e.target.value})}
                                                >
                                                    <option value="" disabled className="bg-slate-900">Select year...</option>
                                                    <option value="1" className="bg-slate-900">1st Year</option>
                                                    <option value="2" className="bg-slate-900">2nd Year</option>
                                                    <option value="3" className="bg-slate-900">3rd Year</option>
                                                    <option value="4" className="bg-slate-900">4th Year+</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 ml-4">Why do you want to join?</label>
                                            <Textarea 
                                                className="min-h-[120px] rounded-[2rem] bg-white/5 border-white/10 focus:border-emerald-500 focus:bg-white/10 text-white font-medium p-6"
                                                required
                                                value={formState.message}
                                                onChange={e => setFormState({...formState, message: e.target.value})}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                                            Submit Application
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}
