declare const character: {
    name: string;
    weapon: {
        name: string;
        price: number;
        style: {
            color: string;
        };
    };
    items: ({
        name: string;
        weight: number;
        quantity: number;
        equipped: boolean;
        price: number;
        description: {
            short: string;
            long: string;
        };
        liquids: {
            type: string;
            drinkable: boolean;
        }[];
    } | {
        name: string;
        weight: number;
        quantity: number;
        equipped: boolean;
        price: number;
        description: {
            short: string;
            long: string;
        };
        liquids?: undefined;
    } | {
        name: string;
        weight: number;
        quantity: number;
        equipped: boolean;
        price?: undefined;
        description?: undefined;
        liquids?: undefined;
    } | {
        name: string;
        weight: number;
        quantity: number;
        equipped: null;
        price?: undefined;
        description?: undefined;
        liquids?: undefined;
    })[];
    strength: {
        'Base Score': number;
        'Permanent Bonus': number;
        'Temporary Bonus': number;
        'Permanent Score': string;
        Score: number;
        'Temporary Modifier': string;
        Modifier: string;
    };
};
export default character;
