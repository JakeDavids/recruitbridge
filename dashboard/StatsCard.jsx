
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const colorConfig = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600"
  },
  green: {
    bg: "bg-green-500", 
    bgLight: "bg-green-100",
    text: "text-green-600",
    gradient: "from-green-500 to-green-600"
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-100", 
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600"
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-100",
    text: "text-orange-600", 
    gradient: "from-orange-500 to-orange-600"
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4
    }
  }
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  const config = colorConfig[color] || colorConfig.blue;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm h-full">
        <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 bg-gradient-to-br ${config.gradient} rounded-full opacity-10`} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${config.bgLight}`}>
            <Icon className={`w-4 h-4 ${config.text}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              <span className="text-slate-500">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
