// Component styles
import styles from './IngredientField.module.scss';
// Type interfaces
import { Item, Ingredient } from '@/types/index';
// Helper functions
import getItemName from '@/helpers/getItemName';
import updateWidth from '@/helpers/updateWidth';
// Next components
import Image from 'next/image';
// React components
import { useState, useEffect, useMemo, useCallback } from 'react';

export default function IngredientField (props: { i: number, ingredients: Item[], removeIngredient: Function, value: Ingredient }) {
    const { i, ingredients, removeIngredient, value } = props;
    const [ingredient, setIngredient] = useState(() => {
        return (document.getElementById(`item-${i}-name`) as HTMLSelectElement)?.value;
    });
    const [ingredientAlias, setIngredientAlias] = useState(0);

    const ingredientId = useMemo(() => {
        if (value && value.hasOwnProperty('Name')) {
            const ingredient = ingredients.find((item: Item) => item.Name === value.Name);
            if (ingredient) return ingredient.Id;    
        }
        return "";
    }, [ingredients, value]);

    useEffect(() => {
        for (const item of ingredients) {
            if (item.Id?.toString() === ingredient) {
                setIngredientAlias(item.AliasId || 0);
            }
        }
    }, [ingredient, ingredients]);

    const unit = useMemo(() => {
        if (ingredient === "21" || ingredientAlias === 21) {
            return "dash";
        } else if (ingredient === "40" || ingredientAlias === 40) {
            return "leaves";
        } else if (ingredient === "46" || ingredientAlias === 46) {
            return "whole";
        } else {
            return "oz";
        }
    }, [ingredient, ingredientAlias]);

    const handleChange = useCallback((e: React.FormEvent<HTMLSelectElement>) => {
        setIngredient(e.currentTarget.value);
        (document.getElementById(`item-${i}-unit`) as HTMLSpanElement).innerHTML = unit;
    }, [i, unit]);

    return (
        <li id={`item-${i}-container`} className={styles.IngredientField}>
            <select name={`item-${i}-name`} id={`item-${i}-name`} defaultValue={ingredientId} onChange={handleChange}>
                <option value="" disabled>Select an ingredient</option>
                <optgroup label="Liquor">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'liquor').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Liqueur">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'liqueur').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Other">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'other').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Wine">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'wine').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Carbonated">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'carbonated').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Juice">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'juice').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
                <optgroup label="Mixer">
                { ingredients.filter((ingredient: Item) => ingredient.Type === 'mixer').map((ingredient: Item, index: number) => {
                    return (
                        <option key={index} value={ingredient.Id}>{getItemName(ingredient)}</option>
                    );
                }) }
                </optgroup>
            </select>
            <input 
                type="number" 
                min="0.25" 
                step="0.25" 
                id={`item-${i}-amount`} 
                name={`item-${i}-amount`}
                placeholder={value.Amount.toString()}/>
            <span id={`item-${i}-unit`}>{value.Unit}</span>
            <button onClick={e => removeIngredient(e, i)}>
                <Image 
                    alt="Remove Ingredient"
                    src={require('/public/images/ui/cancel.svg')} 
                    width="0" 
                    height="24" 
                    title="Remove Ingredient"
                    onLoadingComplete={e => updateWidth(e)} />
            </button>
        </li>
    );
}