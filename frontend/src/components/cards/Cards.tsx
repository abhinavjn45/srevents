import React from 'react';
import { Card, Button } from '../ui/Base';


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
        <Card className="group hover:border-gold transition cursor-pointer" onClick={() => onVote(id)}>
            {image && (
                <div className="aspect-video bg-secondary-bg rounded-16 mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2 capitalize">{title}</h3>
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
    isCurrentCreatorVoting
}) => {
    return (
        <Card className="group hover:border-gold transition">
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
                        <span className="text-sm">📷</span>
                    </a>
                )}
                {youtube && (
                    <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-text-medium hover:text-gold transition">
                        <span className="text-sm">▶️</span>
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
                {isCurrentCreatorVoting ? 'Adding your Vote...' : 'Vote'}
            </Button>
        </Card>
    );
};

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: string;
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
                        <p className={`text-xs mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
                        </p>
                    )}
                </div>
                {icon && <span className="text-3xl">{icon}</span>}
            </div>
        </Card>
    );
};
