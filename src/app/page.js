'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const plantLibrary = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    type: 'Indoor Plant',
    difficulty: 'Medium',
    light: 'Bright Indirect',
    description: 'Famous for its natural leaf-holes, it gives an instant tropical vibe to any space.',
    image: '/monstera_deliciosa_1778093011082.png'
  },
  {
    id: 2,
    name: 'Sweet Basil',
    type: 'Herb',
    difficulty: 'Easy',
    light: 'Full Sun',
    description: 'A versatile culinary herb that grows well in pots and gardens. Perfect for pesto!',
    image: '/sweet_basil_1778093026274.png'
  },
  {
    id: 3,
    name: 'Snake Plant',
    type: 'Succulent',
    difficulty: 'Easy',
    light: 'Low to Bright',
    description: 'One of the toughest indoor plants, known for its air-purifying qualities.',
    image: '/snake_plant_1778093040935.png'
  },
  {
    id: 4,
    name: 'Lavender',
    type: 'Herb / Shrub',
    difficulty: 'Medium',
    light: 'Full Sun',
    description: 'Known for its beautiful purple flowers and calming fragrance. Needs well-draining soil.',
    image: '/lavender_plant_1778093056696.png'
  },
  {
    id: 5,
    name: 'Aloe Vera',
    type: 'Succulent',
    difficulty: 'Easy',
    light: 'Bright Direct',
    description: 'A medicinal plant with soothing gel inside its thick leaves. Very drought tolerant.',
    image: '/aloe_vera_1778093073566.png'
  },
  {
    id: 6,
    name: 'Fiddle Leaf Fig',
    type: 'Indoor Tree',
    difficulty: 'Hard',
    light: 'Bright Indirect',
    description: 'A stunning statement tree with large, violin-shaped leaves. Can be fussy about drafts.',
    image: '/fiddle_leaf_fig_1778093087534.png'
  },
  {
    id: 7,
    name: 'Golden Pothos',
    type: 'Indoor Vine',
    difficulty: 'Easy',
    light: 'Low to Bright',
    description: 'A trailing vine with heart-shaped leaves, incredibly forgiving and perfect for beginners.',
    image: '/golden_pothos_1778102942918.png'
  },
  {
    id: 8,
    name: 'Rosemary',
    type: 'Herb',
    difficulty: 'Medium',
    light: 'Full Sun',
    description: 'A fragrant evergreen herb with needle-like leaves, perfect for cooking and roasting.',
    image: '/rosemary_herb_1778102958066.png'
  },
  {
    id: 9,
    name: 'Peace Lily',
    type: 'Indoor Plant',
    difficulty: 'Easy',
    light: 'Low to Medium',
    description: 'Features elegant white flowers and dark green leaves. Known to be excellent at air purification.',
    image: '/peace_lily_1778102972030.png'
  },
  {
    id: 10,
    name: 'ZZ Plant',
    type: 'Indoor Plant',
    difficulty: 'Easy',
    light: 'Low to Bright',
    description: 'An incredibly resilient plant with waxy, dark green leaves. Perfect for forgetful waterers.',
    image: '/zz_plant_1778103295423.png'
  },
  {
    id: 11,
    name: 'Spider Plant',
    type: 'Indoor Plant',
    difficulty: 'Easy',
    light: 'Bright Indirect',
    description: 'A fast-growing plant that produces babies you can repot. Great for hanging baskets.',
    image: '/spider_plant_1778103310272.png'
  },
  {
    id: 12,
    name: 'Mint',
    type: 'Herb',
    difficulty: 'Medium',
    light: 'Full Sun',
    description: 'A vigorous, aromatic herb that grows aggressively. Best kept in a pot to contain its roots.',
    image: '/mint_herb_1778103324499.png'
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="fs-chat-container" style={{ overflowY: 'auto' }}>
      <div className="interactive-bg">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      <div style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-in delay-1">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="text-gradient">Plant & Herb Library</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Explore our curated collection of plants and herbs. Want to identify a plant you found? Try our new Scanner feature!
          </p>
          <div style={{ marginTop: '2rem' }}>
             <Link href="/scan" className="btn-primary" style={{ textDecoration: 'none' }}>
                Try the Plant Scanner
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-3 animate-in delay-2" style={{ gap: '2rem' }}>
          {plantLibrary.map((plant, index) => (
            <div 
              key={plant.id} 
              className="glass-card hover-lift" 
              onClick={() => router.push(`/chat?plant=${encodeURIComponent(plant.name)}`)}
              style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', cursor: 'pointer' }}
            >
              <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span className={`tag ${plant.difficulty.toLowerCase()} solid-tag`}>{plant.difficulty}</span>
                </div>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{plant.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>{plant.type}</span>
                  <span className="tag" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>☀️ {plant.light}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                  {plant.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
