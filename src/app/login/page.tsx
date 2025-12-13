'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Chrome, Github } from "lucide-react";
import Image from "next/image";
import { SVGProps } from "react";

const tools = [
    { name: "Docker", logo: "/tech-logos/docker.svg" },
    { name: "Kubernetes", logo: "/tech-logos/kubernetes.svg" },
    { name: "Jenkins", logo: "/tech-logos/jenkins.svg" },
    { name: "GitHub", logo: "/tech-logos/github.svg" },
    { name: "Git", logo: "/tech-logos/git.svg" },
    { name: "Terraform", logo: "/tech-logos/terraform.svg" },
    { name: "Ansible", logo: "/tech-logos/ansible.svg" },
    { name: "AWS", logo: "/tech-logos/aws.svg" },
    { name: "Google Cloud", logo: "/tech-logos/google-cloud.svg" },
    { name: "Azure", logo: "/tech-logos/azure.svg" },
    { name: "Linux", logo: "/tech-logos/linux.svg" },
    { name: "OpenShift", logo: "/tech-logos/openshift.svg" },
    { name: "HTML5", logo: "/tech-logos/html5.svg" },
    { name: "CSS3", logo: "/tech-logos/css3.svg" },
    { name: "JavaScript", logo: "/tech-logos/javascript.svg" },
    { name: "React", logo: "/tech-logos/react.svg" },
    { name: "Node.js", logo: "/tech-logos/nodejs.svg" },
    { name: "MySQL", logo: "/tech-logos/mysql.svg" },
    { name: "MongoDB", logo: "/tech-logos/mongodb.svg" },
];

// Custom styles for floating animations
const animationStyles = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
`;


export default function LoginPage() {
    return (
        <>
            <style>{animationStyles}</style>
            <div className="min-h-screen w-full bg-white flex items-center justify-center relative overflow-hidden">
                {tools.map((tool, index) => {
                    const size = Math.floor(Math.random() * 48) + 32; // Random size between 32 and 80
                    const top = `${Math.random() * 90}%`;
                    const left = `${Math.random() * 90}%`;
                    const animationDuration = `${Math.random() * 5 + 5}s`; // Random duration between 5s and 10s
                    const animationDelay = `${Math.random() * 2}s`;
                    return (
                        <div
                            key={index}
                            className="absolute animate-float"
                            style={{ 
                                top, 
                                left, 
                                width: `${size}px`, 
                                height: `${size}px`, 
                                animationDuration,
                                animationDelay,
                            }}
                        >
                            <Image
                                src={tool.logo}
                                alt={tool.name}
                                width={size}
                                height={size}
                                className="opacity-20 blur-[1px] "
                            />
                        </div>
                    );
                })}


                <Card className="w-full max-w-md z-10 animate-in fade-in-0 slide-in-from-bottom-10 duration-500 shadow-2xl border-2 border-primary/20 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-gray-800">CareerPilot AI</CardTitle>
                        <CardDescription className="text-gray-600 pt-2">
                            Your one-stop platform for DevOps & Tech Careers
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            Sign In
                        </Button>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                             <Button variant="outline" className="w-full hover:bg-primary/5">
                                <Chrome className="mr-2 h-4 w-4" />
                                Continue with Google
                            </Button>
                            <Button variant="outline" className="w-full hover:bg-primary/5">
                                <Github className="mr-2 h-4 w-4" />
                                Continue with GitHub
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
