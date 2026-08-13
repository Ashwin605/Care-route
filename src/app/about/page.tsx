import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/footer/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CARE ROUTE',
  description: 'Learn more about CARE ROUTE and our mission to orchestrate intelligent healthcare referrals.',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-20">
        <div className="section-container max-w-4xl">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
              About CARE ROUTE
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              We are redefining healthcare referral orchestration by ensuring that patients get to the right facility at the exact right time.
            </p>
          </div>
          
          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
              <p className="text-base md:text-lg text-muted/80 leading-relaxed">
                Our mission is to eliminate the guesswork and delays in patient transfers. 
                By providing predictive, capacity-aware insights, we empower healthcare professionals to make informed, data-driven decisions that save time and save lives.
                We bridge the gap between referring facilities and receiving hospitals, ensuring seamless communication and coordination throughout the entire referral journey.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">Why We Build This</h2>
              <p className="text-base md:text-lg text-muted/80 leading-relaxed">
                Every minute counts when a patient requires specialized care. Traditional referral processes are often manual, fragmented, and lack real-time visibility into hospital capabilities and capacity. 
                CARE ROUTE introduces a revolutionary approach by combining real-time data, AI-assisted decision support, and transparent tracking to create an intelligent healthcare network.
              </p>
            </section>
            
            <section className="bg-primary/5 rounded-2xl p-8 mt-12 border border-primary/10">
              <h2 className="text-2xl font-semibold text-primary mb-4">Core Principles</h2>
              <ul className="grid sm:grid-cols-2 gap-6 mt-6">
                <li className="flex flex-col gap-2">
                  <span className="font-semibold text-primary">Intelligent Matching</span>
                  <span className="text-sm text-muted/80">Connecting patients with facilities that have the right specialists, equipment, and beds available.</span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-semibold text-primary">Capacity Awareness</span>
                  <span className="text-sm text-muted/80">Predicting capacity at the time of arrival, not just at the time of referral.</span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-semibold text-primary">Seamless Coordination</span>
                  <span className="text-sm text-muted/80">Providing a unified platform for both referrers and receiving hospitals to communicate effectively.</span>
                </li>
                <li className="flex flex-col gap-2">
                  <span className="font-semibold text-primary">Patient-Centric</span>
                  <span className="text-sm text-muted/80">Prioritizing patient safety and ensuring they receive the care they need without unnecessary delays.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
