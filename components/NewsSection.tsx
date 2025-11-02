'use client';

import { FiPlay } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

export default function NewsSection() {
  const videos = [
    {
      id: 'rPVoaYFiIDg',
      title: 'BBC News',
      description: 'In Kibera, located in Kenya\'s capital, some roadside vegetable stands are accepting an unconventional form of payment',
      thumbnail: 'https://img.youtube.com/vi/rPVoaYFiIDg/maxresdefault.jpg'
    },
    {
      id: 'RBUj98JhpWY',
      title: 'AP News',
      description: 'Bitcoin adoption in Africa\'s largest informal settlement',
      thumbnail: 'https://img.youtube.com/vi/RBUj98JhpWY/maxresdefault.jpg'
    },
    {
      id: '0Ov1vgy8Gag',
      title: 'ABC News',
      description: 'Could cryptocurrency help Africa\'s biggest slum?',
      thumbnail: 'https://img.youtube.com/vi/0Ov1vgy8Gag/maxresdefault.jpg'
    },
    {
      id: 'l4mUySspn1E',
      title: 'Firstpost',
      description: 'Bitcoin circular economy transforming lives in Kibera',
      thumbnail: 'https://img.youtube.com/vi/l4mUySspn1E/maxresdefault.jpg'
    },
    {
      id: 'oqREM62cAqk',
      title: 'Associated Press',
      description: 'Financial inclusion through Bitcoin in Kenya',
      thumbnail: 'https://img.youtube.com/vi/oqREM62cAqk/maxresdefault.jpg'
    },
    {
      id: 'LRSQSkiil0M',
      title: 'Joe Nakamoto',
      description: 'I spent a day using Bitcoin as money in Africa',
      thumbnail: 'https://img.youtube.com/vi/LRSQSkiil0M/maxresdefault.jpg'
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-black via-[#0a0a0a] to-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
            Stories From the Heart of the <span className="text-bitcoin">Bitcoin Movement</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Major news outlets from around the world have covered Afribit's groundbreaking work in Kibera
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-white/10 to-white/5 border-2 border-white/10 hover:border-bitcoin/50 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-bitcoin rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiPlay className="w-10 h-10 text-black ml-1" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold mb-3 text-white group-hover:text-bitcoin transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                <span className="text-bitcoin text-xs font-semibold">Watch Now</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
