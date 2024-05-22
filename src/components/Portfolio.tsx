import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Linkedin, Github, Twitter, IdCard } from 'lucide-react';

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];
    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.1,
        speed: Math.random() * 0.015 + 0.005,
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    function drawStars() {
      if (!canvas || !ctx) return;
      
      ctx.fillStyle = 'rgb(17, 24, 39)'; // Matches bg-gray-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        star.opacity = Math.sin(Date.now() * star.speed * 0.2) * 0.3 + 0.5;
      });
    }

    function animate() {
      drawStars();
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

const AnimatedWaveEmoji: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 3000; // 3 seconds duration

    const animateWave = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth start and stop
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      // Wave function
      const wave = (t: number) => Math.sin(t * Math.PI * 4) * easeInOutCubic(1 - t);

      const newRotation = wave(progress) * 15;

      setRotation(newRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateWave);
      } else {
        setRotation(0);
      }
    };

    animationRef.current = requestAnimationFrame(animateWave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'bottom center',
      }}
    >
      👋
    </span>
  );
};

interface Project {
  name: string;
  desc: string;
}

interface Section {
  title: string;
  content: string | Project[];
  icon: React.ReactNode;
}

type Sections = {
  [key: string]: Section;
}

const Portfolio: React.FC = () => {
  const sections: Sections = {
    // ... (sections object remains unchanged)
  };

  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open('/Resume.pdf', '_blank');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 font-sans p-4 sm:p-8 flex items-center justify-center overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-gray-800 bg-opacity-80 p-6 sm:p-10 rounded-xl shadow-2xl backdrop-filter backdrop-blur-sm border border-gray-700">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-100">
            Hi <AnimatedWaveEmoji />
          </h1>
          <p className="text-xl mb-8 text-center text-gray-300">I'm a software engineer with history of working in the consumer electronics industry. Skilled in full-stack web development, cloud architecture, and DevOps.</p>
          
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="mb-8 transition-all duration-500 ease-in-out transform hover:translate-x-2">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="text-blue-400 mr-2">{section.icon}</span>
                <span className="text-gray-100">{section.title}</span>
              </h2>
              {typeof section.content === 'string' ? (
                <p className="text-lg text-gray-300">{section.content}</p>
              ) : (
                <ul className="space-y-4">
                  {section.content.map((project, index) => (
                    <li key={index} className="flex items-start space-x-2 bg-gray-700 bg-opacity-50 p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:shadow-lg">
                      <ChevronRight size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">{project.name}</h3>
                        <p className="text-gray-400">{project.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-8 flex justify-center space-x-6">
            {[
              { href: "https://linkedin.com/in/nikita-petrenko/", Icon: Linkedin },
              { href: "https://github.com/petrenk0n", Icon: Github },
              { href: "https://twitter.com/nikitapett", Icon: Twitter },
              { href: "#", Icon: IdCard, onClick: handleResumeClick }
            ].map(({ href, Icon, onClick }, index) => (
              <a 
                key={index}
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={onClick}
                className="text-gray-400 transition-all duration-300 ease-in-out hover:text-blue-400 transform hover:scale-110"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;