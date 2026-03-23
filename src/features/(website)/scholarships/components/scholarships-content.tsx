import { motion } from "framer-motion";
import { useState } from "react";
import Container from "@/src/components/layouts/container";
import AdBanner from "@/src/components/marketing/AdBanner";
import { ScholarshipGrid } from "./scholarship-grid";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Search } from "lucide-react";

export function ScholarshipsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("all");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section - Cinematic & Functional */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase">
                Financial Empowerment
                </div>
                <h1 className="font-sora text-4xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight">
                Funding Your <span className="text-emerald-400">Future.</span>
                </h1>
                <p className="font-sora text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                Browse our verified database of dental and medical grants.
                </p>
            </motion.div>

            {/* Integrated Filter Bar - Instant Access */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="w-full max-w-4xl group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 shadow-2xl">
                    <div className="flex-1 relative group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 group-focus-within/search:text-emerald-400 transition-colors" />
                        <Input 
                            placeholder="Search by name, university, or location..." 
                            className="w-full h-12 bg-white/5 pl-12 rounded-xl border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/10 font-sora text-sm text-white placeholder:text-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={degreeFilter} onValueChange={setDegreeFilter}>
                        <SelectTrigger className="h-12 w-full md:w-[200px] bg-white/5 rounded-xl border-white/10 focus:border-emerald-500/50 font-sora text-sm text-white">
                            <SelectValue placeholder="Degree Level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-800 bg-slate-900 text-white font-sora">
                            <SelectItem value="all">All Degrees</SelectItem>
                            <SelectItem value="BDS">BDS / DDS</SelectItem>
                            <SelectItem value="Masters">Masters</SelectItem>
                            <SelectItem value="PhD">PhD / Research</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <div className="max-w-7xl mx-auto px-4 w-full mt-8 mb-4">
          <AdBanner zone="HEADER_BANNER" />
      </div>

      <ScholarshipGrid searchQuery={searchQuery} degreeFilter={degreeFilter} />
    </div>
  );
}
