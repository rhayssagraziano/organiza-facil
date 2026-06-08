import {
    Navbar,
    HeroSection,
    FeaturesSection,
    HowItWorks,
    GamificationSection,
    ScoreSection,
    CtaSection,
    Footer,
} from '../components/landing';

const LandingPage = () => {
    return (
        <div style={{ background: '#0D1117', color: '#F1F5F9', fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh' }}>
            <Navbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorks />
            <GamificationSection />
            <ScoreSection />
            <CtaSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
