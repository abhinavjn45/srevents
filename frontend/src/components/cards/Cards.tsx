import React from 'react';
import { Card, Button } from '../ui/Base';
import { Trophy, Instagram, Youtube, TrendingUp, TrendingDown } from 'lucide-react';


interface CategoryCardProps {
    id: number;
    title: string;
    image?: string;
    creatorCount: number;
    votingEnd?: string;
    onVote: (categoryId: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
    id,
    title,
    image,
    creatorCount,
    onVote
}) => {
    return (
        <Card className="group hover:border-gold/50 hover:shadow-[0_0_30px_rgba(230,198,135,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer glass-panel" onClick={() => onVote(id)}>
            {image && (
                <div className="aspect-video bg-secondary-bg rounded-16 mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold capitalize pr-2">{title}</h3>
                <Trophy 
                    className="w-6 h-6 text-gold grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 drop-shadow-[0_0_15px_rgba(230,198,135,0.8)]" 
                />
            </div>
            <p className="text-text-medium text-sm mb-4">{creatorCount} nominees</p>

            <Button variant="primary" size="sm" className="w-full">
                View Nominees
            </Button>
        </Card>
    );
};

interface CreatorCardProps {
    id: number;
    name: string;
    category: string;
    image?: string;
    bio?: string;
    instagram?: string;
    youtube?: string;
    onVote: (categoryId: number, creatorId: number) => void;
    categoryId: number;
    isVoting?: boolean;
    isCurrentCreatorVoting?: boolean;
    buttonText?: string;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
    id,
    name,
    category,
    image,
    bio,
    instagram,
    youtube,
    onVote,
    categoryId,
    isVoting,
    isCurrentCreatorVoting,
    buttonText = 'Vote'
}) => {
    return (
        <Card className="group hover:border-gold/50 hover:shadow-[0_0_30px_rgba(230,198,135,0.15)] hover:-translate-y-2 transition-all duration-500 glass-panel">
            {image && (
                <div className="aspect-square bg-secondary-bg rounded-16 mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
            )}
            
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-text-medium text-sm mb-3 capitalize">{category}</p>
            
            {bio && (
                <p className="text-sm text-text-light mb-4 line-clamp-2">{bio}</p>
            )}

            <div className="flex gap-3 mb-4">
                {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-text-medium hover:text-gold transition">
                        <Instagram className="w-5 h-5" />
                    </a>
                )}
                {youtube && (
                    <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-text-medium hover:text-gold transition">
                        <Youtube className="w-5 h-5" />
                    </a>
                )}
            </div>

            <Button 
                variant="primary" 
                size="sm" 
                className="w-full" 
                onClick={() => onVote(categoryId, id)}
                disabled={isVoting}
                isLoading={isCurrentCreatorVoting}
            >
                {isCurrentCreatorVoting ? 'Adding your Vote...' : buttonText}
            </Button>
        </Card>
    );
};

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    icon,
    trend
}) => {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-medium text-sm mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-gold">{value}</h3>
                    {trend !== undefined && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} 
                            {Math.abs(trend)}% from last period
                        </p>
                    )}
                </div>
                {icon && <div className="text-gold opacity-80">{icon}</div>}
            </div>
        </Card>
    );
};
