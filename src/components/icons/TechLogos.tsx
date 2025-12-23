
'use client';
import { SVGProps, useId } from "react";
import { cn } from "@/lib/utils";

// This file contains the SVG components for the decorative logos on the login page.
export function TechLogos() {
  const id = useId();

  const logos = [
    // DevOps & Containerization
    { component: Docker, className: "w-12 h-12 text-blue-400", style: { top: '10%', left: '15%', animation: 'float 12s ease-in-out infinite' } },
    { component: Kubernetes, className: "w-10 h-10 text-blue-500", style: { top: '15%', right: '10%', animation: 'float-reverse 10s ease-in-out infinite' } },
    { component: Openshift, className: "w-11 h-11 text-red-500", style: { top: '25%', left: '5%', animation: 'float 14s ease-in-out infinite' } },
    { component: Jenkins, className: "w-10 h-10 text-gray-500", style: { top: '50%', left: '5%', animation: 'float 15s ease-in-out infinite' } },
    { component: Git, className: "w-11 h-11 text-red-600", style: { top: '35%', right: '5%', animation: 'float-reverse 13s ease-in-out infinite' } },
    { component: Github, className: "w-9 h-9 text-gray-800", style: { top: '5%', left: '50%', animation: 'float 11s ease-in-out infinite' } },
    { component: Gitlab, className: "w-10 h-10 text-orange-500", style: { bottom: '10%', right: '5%', animation: 'float 16s ease-in-out infinite' } },
    { component: ArgoCD, className: "w-12 h-12 text-orange-600", style: { bottom: '5%', left: '20%', animation: 'float-reverse 12s ease-in-out infinite' } },
    { component: Helm, className: "w-10 h-10 text-blue-600", style: { top: '70%', left: '10%', animation: 'float 10s ease-in-out infinite' } },
    
    // Cloud & Infrastructure
    { component: Aws, className: "w-12 h-12 text-orange-400", style: { top: '70%', right: '5%', animation: 'float 16s ease-in-out infinite' } },
    { component: Gcp, className: "w-10 h-10 text-blue-500", style: { top: '5%', right: '30%', animation: 'float 12s ease-in-out infinite' } },
    { component: Azure, className: "w-10 h-10 text-blue-400", style: { bottom: '5%', right: '40%', animation: 'float-reverse 9s ease-in-out infinite' } },
    
    // IaC & Config Management
    { component: Terraform, className: "w-10 h-10 text-purple-600", style: { bottom: '10%', left: '10%', animation: 'float 11s ease-in-out infinite' } },
    { component: Ansible, className: "w-12 h-12 text-black", style: { bottom: '20%', right: '15%', animation: 'float-reverse 14s ease-in-out infinite' } },

    // Operating Systems
    { component: Linux, className: "w-10 h-10 text-yellow-400", style: { top: '90%', right: '50%', animation: 'float-reverse 13s ease-in-out infinite' } },
    { component: Ubuntu, className: "w-10 h-10 text-orange-600", style: { top: '30%', left: '30%', animation: 'float 15s ease-in-out infinite' } },
    { component: RedHat, className: "w-12 h-12 text-red-600", style: { bottom: '25%', right: '45%', animation: 'float 11s ease-in-out infinite' } },

    // Monitoring & Logging
    { component: Prometheus, className: "w-10 h-10 text-orange-700", style: { bottom: '40%', left: '5%', animation: 'float 13s ease-in-out infinite' } },
    { component: Grafana, className: "w-9 h-9 text-orange-500", style: { top: '60%', left: '25%', animation: 'float-reverse 12s ease-in-out infinite' } },
    { component: Elasticsearch, className: "w-10 h-10 text-teal-500", style: { bottom: '50%', right: '25%', animation: 'float 15s ease-in-out infinite' } },

    // Security & Identity
    { component: Oauth, className: "w-12 h-12 text-blue-600", style: { top: '5%', left: '20%', animation: 'float 16s ease-in-out infinite' } },
    { component: Vault, className: "w-10 h-10 text-gray-500", style: { bottom: '50%', left: '35%', animation: 'float-reverse 11s ease-in-out infinite' } },

    // Web Development
    { component: ReactLogo, className: "w-12 h-12 text-blue-400", style: { top: '5%', left: '45%', animation: 'float 10s ease-in-out infinite' } },
    { component: Nodejs, className: "w-10 h-10 text-green-500", style: { top: '35%', right: '20%', animation: 'float 13s ease-in-out infinite' } },
    { component: Html5, className: "w-10 h-10 text-orange-600", style: { bottom: '15%', left: '55%', animation: 'float-reverse 15s ease-in-out infinite' } },
    { component: Css3, className: "w-10 h-10 text-blue-600", style: { top: '60%', right: '25%', animation: 'float 12s ease-in-out infinite' } },
    { component: Javascript, className: "w-9 h-9 text-yellow-400", style: { top: '20%', left: '5%', animation: 'float-reverse 13s ease-in-out infinite' } },
    { component: Typescript, className: "w-9 h-9 text-blue-500", style: { bottom: '35%', left: '45%', animation: 'float 14s ease-in-out infinite' } },

    // Databases
    { component: Mysql, className: "w-12 h-12 text-blue-600", style: { bottom: '40%', right: '5%', animation: 'float-reverse 16s ease-in-out infinite' } },
    { component: Postgresql, className: "w-10 h-10 text-blue-700", style: { bottom: '50%', left: '20%', animation: 'float 10s ease-in-out infinite' } },
    { component: Mongodb, className: "w-12 h-12 text-green-600", style: { top: '65%', left: '15%', animation: 'float-reverse 14s ease-in-out infinite' } },
    { component: Redis, className: "w-10 h-10 text-red-600", style: { bottom: '60%', right: '10%', animation: 'float 12s ease-in-out infinite' } },
    
    // Extra icons from image
    { component: GridIcon, className: "w-10 h-10 text-gray-300", style: { top: '80%', left: '20%', animation: 'float 12s ease-in-out infinite' } },
    { component: LayersIcon, className: "w-12 h-12 text-gray-300", style: { bottom: '70%', right: '30%', animation: 'float-reverse 11s ease-in-out infinite' } },
    { component: CircleIcon, className: "w-10 h-10 text-red-300", style: { bottom: '10%', left: '40%', animation: 'float 9s ease-in-out infinite' } },
    { component: EyeIcon, className: "w-10 h-10 text-gray-400", style: { top: '5%', left: '10%', animation: 'float 14s ease-in-out infinite' } },
    { component: ClockIcon, className: "w-12 h-12 text-gray-300", style: { top: '15%', left: '60%', animation: 'float-reverse 13s ease-in-out infinite' } },
    { component: PuzzleIcon, className: "w-10 h-10 text-gray-300", style: { top: '25%', right: '25%', animation: 'float 10s ease-in-out infinite' } },
  ];

  return (
    <div className="absolute inset-0 z-0">
      {logos.map(({ component: Component, className, style }, index) => (
        <div key={`${id}-${index}`} className={cn("logo-container absolute opacity-40 transition-opacity duration-300", className)} style={style}>
          <Component />
        </div>
      ))}
    </div>
  )
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props} fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const Docker = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 256 256" {...props}><path d="M255.4 134.3c-2-19.1-15-27-15-27l-51.5-16.7s-10-5.6-26.6 6.8c-10.6 8-16.8 17.1-16.8 17.1s-10.1 11.2-11.2 11.2h-40.3c-1.2 0-11.2-11.2-11.2-11.2s-6.2-9.1-16.8-17.1C50 90.6 40 96.2 40 96.2L15.3 88.5s-12.8 1.1-14.8 12.3c-1.4 7.9-1.3 15.8-1.3 23.7v.1c0 10.7 2.8 30.1 2.8 30.1s-1.8 12.7 10.5 21.6c7.7 5.5 14.4 6.2 14.4 6.2s34.2 12.1 40.3 14.1c6.1 2 12.3 3.3 12.3 3.3h51.5l12.3-3.3s34.2-12.1 40.3-14.1c6.1-2 14.4-6.2 14.4-6.2s12.3-8.9 10.5-21.6c-1.7-12.6 2.8-30.1 2.8-30.1v-.1c.1-10.6-.6-18.4-2-26.3zM70.9 104.9c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-1.9-4.4-4.4-4.4zm-14.3 0c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm0 13.3c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm14.3 0c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm14.4-13.3c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm14.4 0c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm14.4 0c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm0 13.3c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm-14.4 0c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4zm28.8-13.3c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4 4.4-2 4.4-4.4-2-4.4-4.4-4.4z" /></svg>;
const Kubernetes = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12.112.085l-9.43 5.39v10.95l9.43 5.492l9.43-5.492V5.475zm6.54 15.345l-6.54 3.707l-6.54-3.707V6.524l6.54-3.81l6.54 3.81zM12 10.41L7.59 7.91L6.11 8.7v6.6l1.48.89l4.41-2.5zm0-2.02l4.41 2.5l1.48-.89V8.7L16.41 7.9zM12 11.6l4.41 2.5v-1.6L12 10.8z" /></svg>;
const Openshift = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 14 14" {...props}><path d="M11.3 6.9L7 4.6 2.7 6.9v-2L7 2.6l4.3 2.3zM7 11.4l4.3-2.3v-2L7 9.4l-4.3-2.3v2z" /></svg>;
const Jenkins = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 256 256" {...props}><path d="M198 128l-32.5 32.5L198 193l-32.5 32.5-32.5-32.5-32.5 32.5-32.5-32.5 32.5-32.5-32.5-32.5L100.5 63l32.5 32.5 32.5-32.5L198 95.5zm-65 0a32.5 32.5 0 10-65 0 32.5 32.5 0 0065 0z" /></svg>;
const Git = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M22.84 9.17L14.83 1.16a3.94 3.94 0 00-5.58 0L1.16 9.24a3.94 3.94 0 000 5.58l8.08 8.08a3.94 3.94 0 005.58 0l8.02-8.02a3.94 3.94 0 000-5.71zM9.5 18V9.33l-4 4L4.08 12l5.42-5.42L15 12l-1.41 1.41-4.09-4.08V18z" /></svg>;
const Github = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0022 12C22 6.48 17.52 2 12 2z" /></svg>;
const Gitlab = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M23.6 8.2l-1.9-5.9c-.3-1-1.2-1.7-2.3-1.7H4.6c-1.1 0-2.1.7-2.3 1.7L.4 8.2c-.2.6.1 1.2.6 1.6l11 8.5 11-8.5c.5-.4.8-1 .6-1.6zM12 16.5L2.8 9.3l1.5-4.7h15.4l1.5 4.7z" /></svg>;
const ArgoCD = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2.5a.8.8 0 01.8.8v6.4a.8.8 0 01-.8.8H5.2a.8.8 0 01-.5-.1l3.5-3.5a.8.8 0 000-1.1l-1-1a.8.8 0 00-1.1 0l-5.6 5.6a.8.8 0 000 1.1l5.6 5.6a.8.8 0 001.1 0l1-1a.8.8 0 000-1.1l-3.5-3.5a.8.8 0 01.4-.2h6.8a.8.8 0 01.8.8v6.4a.8.8 0 01-.8.8.8.8 0 01-.8-.8v-6.4a.8.8 0 01-.8-.8h-3.2a.8.8 0 010-1.6h3.2a.8.8 0 01.8.8v6.4a.8.8 0 01.8.8zm0 15.8a.8.8 0 01.8-.8h6.8a.8.8 0 01.5.1l-3.5 3.5a.8.8 0 000 1.1l1 1a.8.8 0 001.1 0l5.6-5.6a.8.8 0 000-1.1l-5.6-5.6a.8.8 0 00-1.1 0l-1 1a.8.8 0 000 1.1l3.5 3.5a.8.8 0 01-.4.2h-6.8a.8.8 0 01-.8-.8v-6.4a.8.8 0 01.8-.8.8.8 0 01.8.8v6.4a.8.8 0 01.8.8h3.2a.8.8 0 110 1.6h-3.2a.8.8 0 01-.8-.8v-6.4a.8.8 0 01-.8-.8z" /></svg>;
const Helm = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2l-9.5 5.5v11L12 22l9.5-3.5v-11zM7 14.5l5 2.89 5-2.89V9l-5 2.89L7 9zm5-8.32L18.6 10l-5 2.89L7.4 10z" /></svg>;
const Aws = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 256 256" {...props}><path d="M189.6 156.4c-7.2-2.1-13.6-5.8-19.1-10.8l-1.9-1.7c-5.2-4.9-11.4-8.3-18.2-9.9l-11.3-2.6c-.6 0-1.2-.2-1.6-.6-.4-.4-.7-1-.7-1.6v-1c.1-10.7-3.9-21.1-11.6-29.2-7.7-8.1-18.4-13.3-29.9-14.7-1.1-.1-2.2-.3-3.3-.4h-.3c-11.3-1-22.3 2.1-31.5 8.7-9.3 6.6-16.1 16-19.3 26.8-.6 2.1-1.1 4.2-1.5 6.4-.3 1.9-2 3.3-3.9 3.3H32.4c-2.2 0-4-1.8-4-4v-1.1c0-1.2.9-2.3 2.1-2.6 1.4-.3 2.9-.6 4.3-.8 1.1-.2 2.2-.4 3.3-.7 12-2.7 23.3-9.5 31.6-19.4 8.3-9.9 13.1-22.1 13.4-34.9.1-2.5.3-5 .6-7.5.1-.9.1-1.9.2-2.8.2-1.9.5-3.8.8-5.7.5-2.9 1.3-5.7 2.2-8.5.1-.3.3-.6.5-.8.2-.3.5-.5.9-.6.3-.1.7-.1 1-.1.4 0 .7.1 1 .3.3.2.6.4.8.7.6.9 1.1 1.8 1.5 2.8.5 1.2.9 2.5 1.3 3.8l.2.8.2.8c.2 1 .3 1.9.5 2.9.2.9.4 1.8.6 2.7.7 3.3 1.1 6.6 1.1 10V93c0 2.2-1.8 4-4 4h-1.6c-2.1 0-3.8-1.7-3.9-3.7-.1-1.3-.2-2.5-.4-3.8l-.2-1.1c-.2-.9-.4-1.8-.7-2.7-.4-2-.9-4-1.5-5.9-.6-1.9-1.3-3.7-2.1-5.5-.3-.7-.7-1.3-1.1-1.9-.5-.6-1-1-1.6-1.4-.6-.4-1.3-.7-2-.9-.7-.2-1.4-.3-2.1-.3-1.6 0-3.2.4-4.6 1.1-1.5.7-2.8 1.6-4 2.8-1.2 1.2-2.2 2.5-3 4-1.4 2.8-2.4 5.9-3 9-.7 3.3-1 6.8-1 10.3 0 13.5 4.5 26.4 12.6 36.6 8.1 10.2 19.3 17.1 32.1 19.8 13.5 2.9 27.6.2 39.8-7.5 12.2-7.7 21.6-18.7 26.6-31.5.3-.7.6-1.4.9-2.1.2-.7.4-1.3.6-2 .1-.3.2-.5.3-.8.1-.3.2-.6.3-.9.1-.3.2-.7.3-1.l.1-.3.2-.6.2-.9.1-.3.1-.6.2-.9.1-.3.1-.6.1-.8v-.4c.1-1 .1-2 .1-3v-.5c.3-7.5 3-14.7 7.7-20.9 4.7-6.2 11.2-11.1 18.7-14.2 2-.8 4.1-1.5 6.2-2.1 1-.3 2-.5 3-.7l.5-.1h.3c1-.2 2.1-.3 3.1-.4h.3c.9-.1 1.9-.1 2.8-.1h.3c1 0 2 .1 3 .2l.5.1c1 .1 2 .3 3 .5l.5.1c2 .4 3.9.9 5.8 1.4 1.9.6 3.8 1.2 5.6 2 2 .8 3.9 1.7 5.7 2.7 7.6 4.1 14.1 9.8 18.9 16.6 4.8 6.8 7.6 14.6 7.9 22.8.1 1.6.1 3.2.1 4.8v1.1c0 2.2-1.8 4-4 4h-1.5c-2.1 0-3.8-1.6-4-3.7-.1-1.6-.1-3.2-.1-4.8-.3-7.1-2.6-13.8-6.9-19.4-4.3-5.6-10.3-9.9-17.2-12.4-1.7-.6-3.4-1.2-5.1-1.6-1.8-.5-3.6-.9-5.4-1.2-1.8-.3-3.7-.5-5.5-.6-1.8-.1-3.6-.1-5.4-.1-2.2 0-4.4.1-6.6.4-2.2.3-4.3.7-6.4 1.2-8.5 2.1-16.2 6.5-22.3 12.7-6.1 6.2-10.4 13.9-12.3 22.4-.6 2.5-1 5.1-1.2 7.7-.2 2.6-.2 5.3-.2 8.1 0 2.2-1.8 4-4 4h-2c-2.2 0-4-1.8-4-4v-1.1c.1-3.7.6-7.3 1.5-10.9.9-3.5 2.2-7 3.8-10.3 3-6.1 7.1-11.4 12-15.9 5-4.5 10.6-8 16.9-10.4 6.3-2.4 13-3.6 19.8-3.6h-.4c6.7 0 13.3 1.2 19.5 3.5 6.2 2.3 12 5.7 17.1 9.9 5.1 4.2 9.4 9.2 12.7 14.8 3.3 5.6 5.5 11.6 6.5 17.9.5 3.2.8 6.4.8 9.6v-1.1c0-2.2-1.8-4-4-4h-1.4c-2.2 0-4 1.8-4 4V193c0 2.2 1.8 4 4 4h.6c-2.2 0-4-1.8-4-4v-19.1c0-2.2 1.8-4 4-4h.6c-2.2 0-4-1.8-4-4v-19.1c0-2.2 1.8-4 4-4h.6c-2.2 0-4-1-4-4V95.6c0-2.2 1.8-4 4-4h.6zm132.8-47.5z" /></svg>;
const Gcp = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 15.25a4.25 4.25 0 01-3.64-6.52 4.25 4.25 0 016.52-.39h.01a4.25 4.25 0 01-2.9 6.91z" /><path d="M18.89 12.89A8.51 8.51 0 0115.11 20H8.89v-2.22h6.22a6.29 6.29 0 005.1-9.64L18.89 9.5z" /><path d="M8.89 10.89a6.29 6.29 0 00-4.32 3.84L5.89 16a8.51 8.51 0 013-12h6.22V6.22H8.89a8.51 8.51 0 010 4.67z" /><path d="M8.89 4A8.51 8.51 0 0115.11 8.89h3.78L17.57 7.57a6.29 6.29 0 00-9.64-5.1L6.61 3.79A8.51 8.51 0 018.89 4z" /></svg>;
const Azure = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M17.48 6.09L9.12 17.65l-4.57-2.34L.45 6.09zM10.15 17.65l5.22-14.86h8.18L10.15 17.65z" /></svg>;
const Terraform = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M2 2h7.07v7.07H2zm8.59 0h7.07v7.07h-7.07zM2 10.59h7.07v7.07H2zm8.59 0h7.07v7.07h-7.07z" /></svg>;
const Ansible = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L1 9l11 7 11-7zM1 10l11 7v6l-11-7z" /></svg>;
const Linux = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1.5 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9 14s1 2 3 2 3-2 3-2H9z" /></svg>;
const Ubuntu = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-3.5-3.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3.5-7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const RedHat = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M21.5 9.5c-2.4-1.9-5.1-3-8-3-2.9 0-5.6.9-8 2.5l-1.5 5C4 18.5 7.7 22 12 22s8-3.5 8-7.5c0-.1-.1-.3-.1-.4l1.6-4.6zM13 18s-1 1-2 1-2-1-2-1v-4h4v4zm-1-6H8V9c1-.5 2.2-.5 3 0v3z" /></svg>;
const Prometheus = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9.58V8h4v2.42l-2 2-2-2zM12 16c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" /></svg>;
const Grafana = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-5v4h3l-4 5z" /></svg>;
const Elasticsearch = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zM9.5 9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 100-5z" /></svg>;
const Oauth = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-11H11v2h1.5c1.38 0 2.5 1.12 2.5 2.5S13.88 16 12.5 16H11v2H9V8h2.5c1.38 0 2.5 1.12 2.5 2.5S12.88 13 11.5 13H11v-2h.5z" /></svg>;
const Vault = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2L2 7v10l10 5 10-5V7zm0 2.3l8 4-8 4-8-4zm-8 6.4L12 15l8-4.3V18l-8 4-8-4z" /></svg>;
const ReactLogo = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="-11.5 -10.23174 23 20.46348" {...props}><circle cx="0" cy="0" r="2.05" /><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2" /><ellipse rx="11" ry="4.2" transform="rotate(60)" /><ellipse rx="11" ry="4.2" transform="rotate(120)" /></g></svg>;
const Nodejs = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M11.99 24a12 12 0 01-4.72-23.03 12 12 0 017.3 21.53c.12-.4.18-.8.18-1.21v-3.48c0-.42.22-.68.56-.81 1.73-.65 2.92-2.16 2.92-3.95 0-2.38-1.92-4.3-4.3-4.3s-4.3 1.92-4.3 4.3v5.52c0 .42-.22.68-.56.81A7.63 7.63 0 0112 .42a11.58 11.58 0 0111.58 11.58A11.58 11.58 0 0112 23.58a12 12 0 01-.01.42z" /></svg>;
const Html5 = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M1.6 0h20.8l-1.9 21.6-8.5 2.4-8.5-2.4L1.6 0z" /><path d="M12 1.8v19.4l7.2-2L21.3 1.8H12z" /><path d="M12 8.7h-4.3l-.3-3.3H12V8.7zm0 3.3H8.1l.3 3.3h3.6V12zm0 6.5l3.6-1v-3.3H12V18.5z" /><path d="M12 8.7V5.4h4l.3 3.3h-4.3zm0 3.3h3.6l-.3 3.3-3.3 1V12z" /></svg>;
const Css3 = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M1.6 0h20.8l-1.9 21.6-8.5 2.4-8.5-2.4L1.6 0z" /><path d="M12 1.8v19.4l7.2-2L21.3 1.8H12z" /><path d="M12 8.7h-4.3l-.3-3.3H12V8.7zm0 3.3H8.1l.3 3.3h3.6V12zm0 6.5l3.6-1v-3.3H12V18.5z" /><path d="M12 8.7V5.4h4l.3 3.3h-4.3zm0 3.3h3.6l-.3 3.3-3.3 1V12z" /></svg>;
const Javascript = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M0 0h24v24H0z" /><path d="M12.23 18.06c.39.69 1.25 1.14 2.11 1.14.98 0 1.63-.58 1.63-1.39 0-.9-.6-1.3-2.05-1.85l-.8-.28c-2.14-.78-3.56-1.8-3.56-4.06.56-3.23 1.94-3.23 1.63 0 2.8.94 3.32 2.25l-1.98.85c-.24-.55-.8-.92-1.34-.92-.6 0-1.02.43-1.02 1.1 0 .76.4 1.17 1.63 1.63l.8.28c2.5.89 3.96 1.94 3.96 4.14 0 2.5-1.72 3.53-4.14 3.53-2.3 0-3.8-1.2-4.3-2.6L12.23 18.06zm-6.07-5.36c0-2.3.98-3.87 2.9-3.87 1.85 0 2.8.98 2.8 3.83v5.32h2.3V12.7c0-3.6-1.63-5.5-4.93-5.5-3.36 0-5.15 2.05-5.15 5.57v5.27h2.24v-5.23z" /></svg>;
const Typescript = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M1.5 1.5h21v21h-21z" /><path d="M12.5 16.3h2.8v- торговымh2.8zM5.3 5.3h13.4v13.4H5.3z" /><path fill="#fff" d="M12.8 13.2H9.5v1.6h3.3v1.5H9.5v1.6h3.3v1.5H8V8h7.9v1.5h-4.8v2.1h3.2v1.6z" /></svg>;
const Mysql = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 14h-2.5v-2.5H11V16H8.5v-2.5H6v-3h2.5V8h2.5v2.5H14V13h3v3z" /><path d="M11 13.5h2.5V16H11zM8.5 11h2.5v2.5H8.5zM11 8h2.5v2.5H11zM14 10.5h2.5V13H14z" /></svg>;
const Postgresql = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 7v10h2V7h-2zm-4 4v3h2v-3H8zm8 0v3h2v-3h-2z" /></svg>;
const Mongodb = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8c.34 0 .68-.02 1-.06V4.06c-.32-.04-.66-.06-1-.06z" /></svg>;
const Redis = (props: SVGProps<SVGSVGElement>) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-3h2v-5h-2zm0-6h2V4h-2z" /></svg>;

const GridIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18M12 3v18"/></svg>);
const LayersIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-8.58 3.9a2 2 0 0 1-1.66 0L2.6 17.65"/><path d="m22 12.65-8.58 3.9a2 2 0 0 1-1.66 0L2.6 12.65"/></svg>);
const CircleIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/></svg>);
const EyeIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
const ClockIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>);
const PuzzleIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19.43 12.03c.25.82.25 1.71 0 2.53l-2.4 7.93c-.22.72-.89 1.2-1.65 1.2h-7.9c-.77 0-1.43-.48-1.65-1.2L3.43 14.5c-.25-.82-.25-1.71 0-2.53l2.4-7.93c.22-.72.89-1.2 1.65-1.2h7.9c.77 0 1.43.48 1.65 1.2l2.4 7.93Z"/><path d="M12.03 3.43c.82-.25 1.71-.25 2.53 0l7.93 2.4c.72.22 1.2.89 1.2 1.65v7.9c0 .77-.48 1.43-1.2 1.65l-7.93 2.4c-.82.25-1.71.25-2.53 0l-7.93-2.4c-.72-.22-1.2-.89-1.2-1.65v-7.9c0-.77.48-1.43 1.2-1.65l7.93-2.4Z"/></svg>);
