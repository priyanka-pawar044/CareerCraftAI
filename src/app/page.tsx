import { redirect } from 'next/navigation'

// TODO: Replace with logic to check if user is authenticated
const isAuthenticated = false;

export default function Home() {
  if (isAuthenticated) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
