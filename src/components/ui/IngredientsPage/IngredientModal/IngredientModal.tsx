// Component styles
import styles from './IngredientModal.module.scss';
// Next components
import Image from 'next/image';
// Redux components
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleIngredientModal } from '@/store/slices/ingredientModal.slice';
import { useGetAllIngredientsQuery } from '@/store/api/api';
import { addIngredient, removeIngredient } from '@/store/slices/ingredients.slice';
// Local components
import Ingredient from '@/components/ui/IngredientsPage/Ingredient/Ingredient';
import LoadingAnimation from '@/components/loading/LoadingAnimation';
import ServerError from '@/components/error/ServerError';
import SelectAllButton from '@/components/buttons/SelectAllButton/SelectAllButton';
import CloseButton from '@/components/buttons/CloseButton/CloseButton';
// Type interfaces
import { Item } from '@/types/index';
// Helper functions
import updateWidth from '@/helpers/updateWidth';
import getSlug from '@/helpers/getSlug';
// React components
import { useCallback, useMemo, useState, useEffect } from 'react';

export default function IngredientModal () {
    // Redux selectors
    const ingredientModalOpen = useSelector((state: RootState) => state.ingredientModal.open);
    const modalIngredient = useSelector((state: RootState) => state.ingredientModal.ingredient);
    const storedIngredients = useSelector((state: RootState) => state.ingredients.stored);
    // Redux API data
    const allIngredients = useGetAllIngredientsQuery();
    const dispatch = useDispatch();
    // React local state
    const [ingredients, setIngredients] = useState([] as Item[]);
    const [imageSrc, setImageSrc] = useState(`https://img.makedr.ink/i/${getSlug(modalIngredient.Name)}.webp`);

    useEffect(() => {
        if (allIngredients.isSuccess) {
            setIngredients(allIngredients.data);
        }
    }, [allIngredients]);

    const addAllIngredients = useCallback(() => {
        dispatch(addIngredient(modalIngredient));
        const childIngredients = ingredients.filter((ingredient: Item) => ingredient.AliasId === modalIngredient.Id);
        
        for (const ingredient of childIngredients) {
            dispatch(addIngredient(ingredient));
        }
    }, [ingredients, dispatch, modalIngredient]);

    const removeAllIngredients = useCallback(() => {
        dispatch(removeIngredient(modalIngredient));
        const childIngredients = ingredients.filter((ingredient: Item) => ingredient.AliasId === modalIngredient.Id);
        
        for (const ingredient of childIngredients) {
            dispatch(removeIngredient(ingredient));
        }
    }, [dispatch, ingredients, modalIngredient]);

    const childIngredients = useMemo(() => {
        const arr = ingredients.filter((ingredient: Item) => ingredient.AliasId === modalIngredient.Id);
        arr.push(modalIngredient);
        return arr;
    }, [ingredients, modalIngredient]);

    const allIngredientsStored = useMemo(() => {
        return childIngredients.every((item: Item) => {
            if (item.Type && storedIngredients.hasOwnProperty(item.Type)) {
                for (const key of Object.keys(storedIngredients[item.Type])) {
                    const storedItem = storedIngredients[item.Type][key].find((storedItem: Item) => item.Id === storedItem.Id);

                    if (storedItem) {
                        return true;
                    }
                }
            }
        });
    }, [childIngredients, storedIngredients]);

    return (
        <>
        { ingredientModalOpen && modalIngredient && (ingredients.length > 0) &&
            <div className={styles.background}>
                <div className={styles.modal}>
                    <CloseButton 
                        onClick={() => dispatch(toggleIngredientModal())} 
                        text='Close Ingredient Modal' />
                    <div className={styles.header}>
                        <span>{modalIngredient.Name}</span>
                        <SelectAllButton 
                            clickEvent={allIngredientsStored ? removeAllIngredients : addAllIngredients} 
                            ingredients={childIngredients} />
                        <Image 
                            alt={modalIngredient.Name} 
                            src={imageSrc} 
                            width="0" 
                            height="48" 
                            onError={() => setImageSrc('https://img.makedr.ink/i/cocktail.webp')} 
                            onLoadingComplete={e => updateWidth(e)} 
                            unoptimized />
                    </div>
                    <ul className={styles.childList}>
                        { childIngredients.map((ingredient: Item) => <Ingredient key={ingredient.Id} item={ingredient} section={[]} />) }
                    </ul>
                </div>
            </div> }
        { ingredientModalOpen && allIngredients.isLoading && !allIngredients.isError && 
            <LoadingAnimation /> }
        { ingredientModalOpen && allIngredients.isError &&
            <ServerError /> }
        </>
    );
}