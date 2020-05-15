import React from 'react';
import PaginatorButton from './PaginatorButton';
import '../styles/paginator.scss';
import {inject, observer} from "mobx-react";
import { IMainStore } from '../stores/mainStore';

interface AppProps {
    mainStore?: IMainStore;
}

const buttonBlockId = "paginator-elements";
const buttonIdText = "paginator-element-";
const buttonMarginsSize = 10;

@inject("mainStore")
@observer
export default class Paginator extends React.Component<AppProps> {

    handleSizeUpdate = (isGoingBeyoud?: boolean) => {
        function addHiddenClass(button: HTMLElement | null) {
            if (button) {
                button.classList.add('hidden');
            }
        }

        function removeHiddenClass(button: HTMLElement | null) {
            if (button) {
                button.classList.remove('hidden');
            } 
        }

        function dataCalculation(mainStore: IMainStore) {
            const block = document.getElementById(buttonBlockId);
            const blockWidth = block?.offsetWidth;
    
            if (!blockWidth) {
                return;
            }
    
            let buttonsWidth = 0;
    
            let leftIndex = mainStore.leftIndex;
            let rightIndex = mainStore.rightIndex;
            let selectedIndex = mainStore.selectedIndex;
    
            let isReverse = false;
    
            if (!selectedIndex && selectedIndex!==0) {
                return;
            }
    
            if (isGoingBeyoud) {
                if (selectedIndex < leftIndex) {
                    isReverse = true;
                }
    
                leftIndex = selectedIndex;
                rightIndex = selectedIndex;
            }
    
            for(let i=leftIndex; i<=rightIndex; i++) {
                const buttonId = buttonIdText + i.toString();
                const button = document.getElementById(buttonId);
                
    
                if (!button) {
                    alert('no element with id = ' + buttonId);
                    continue;
                }
    
                removeHiddenClass(button);
                buttonsWidth += button?.offsetWidth + buttonMarginsSize ;
            }
    
            const delta = blockWidth - buttonsWidth;

            return { delta: delta, leftIndex: leftIndex, rightIndex: rightIndex, isReverse: isReverse, selectedIndex: selectedIndex };
        }

        function addButtons(delta: number, leftIndex: number, rightIndex: number, isReverse?: boolean) {
            //if isReverse - left and right will be replaced by each other
            let defaultWay = isReverse ? -1 : 1;
        
            let deltaLeft = delta - buttonMarginsSize;
            let canGoNext = true;
            
            let newBorderIndexes = {left: leftIndex, right: rightIndex};
            
            while(canGoNext) {
                const buttonIdLeft = buttonIdText + (newBorderIndexes.left-defaultWay).toString();
                const buttonIdRight = buttonIdText + (newBorderIndexes.right+defaultWay).toString();

                const buttonLeft = document.getElementById(buttonIdLeft);
                const buttonRight = document.getElementById(buttonIdRight);

                removeHiddenClass(buttonLeft);
                removeHiddenClass(buttonRight);

                let buttonLeftWidth = buttonLeft?.offsetWidth;
                let buttonRightWidth = buttonRight?.offsetWidth;

                if (buttonRight && buttonRightWidth) {
                    buttonRightWidth += buttonMarginsSize;
                    if (deltaLeft > buttonRightWidth) {
                        deltaLeft = deltaLeft - buttonRightWidth;
                        
                        newBorderIndexes.right += defaultWay; 

                        continue;
                    } else {
                        addHiddenClass(buttonRight);
                    }
                }

                if (buttonLeft && buttonLeftWidth) {
                    buttonLeftWidth += buttonMarginsSize
                    if (deltaLeft > buttonLeftWidth) {
                        deltaLeft = deltaLeft - buttonLeftWidth;
                        newBorderIndexes.left -= defaultWay;

                        continue;
                    } else {
                        addHiddenClass(buttonLeft);
                    }
                }

                canGoNext = false;
            }
            
            if (isReverse) {
                let temp = newBorderIndexes.left;
                newBorderIndexes.left = newBorderIndexes.right;
                newBorderIndexes.right = temp;
            }

            return newBorderIndexes;
        }

        function removeButtons(delta: number, leftIndex: number, rightIndex: number, selectedIndex: number) {
            let deltaLeft = delta - buttonMarginsSize;
            let canGoNext = true;
            
            let newBorderIndexes = {left: leftIndex, right: rightIndex};

            while(canGoNext) {
                if (deltaLeft >= 0) {
                    canGoNext = false;
                    continue;
                }

                if (newBorderIndexes.right !== selectedIndex) {
                    const buttonIdRight = buttonIdText + (newBorderIndexes.right-1).toString();
                    const buttonRight = document.getElementById(buttonIdRight);

                    removeHiddenClass(buttonRight);

                    const buttonRightWidth = buttonRight?.offsetWidth;

                    if (buttonRightWidth) {
                        deltaLeft = deltaLeft + buttonRightWidth + buttonMarginsSize;
                        newBorderIndexes.right -= 1; 

                        continue;
                    } else {
                        addHiddenClass(buttonRight);
                    }
                }

                if (newBorderIndexes.left !== selectedIndex) {
                    const buttonIdLeft = buttonIdText + (newBorderIndexes.left+1).toString();
                    const buttonLeft = document.getElementById(buttonIdLeft);

                    removeHiddenClass(buttonLeft);

                    const buttonLeftWidth = buttonLeft?.offsetWidth;

                    if (buttonLeftWidth) {
                        deltaLeft = deltaLeft + buttonLeftWidth + buttonMarginsSize;
                        newBorderIndexes.left += 1; 

                        continue;
                    } else {
                        addHiddenClass(buttonLeft);
                    }
                }

                canGoNext = false;
            }

            return newBorderIndexes;
        }

        const mainStore = this.props.mainStore;

        if (!mainStore) {
            return;
        }

        const sizeUpdateData = dataCalculation(mainStore);

        if (!sizeUpdateData) {
            return;
        }

        const { leftIndex, rightIndex, delta, isReverse, selectedIndex } = sizeUpdateData;

        let newBorderIndexes = { left: leftIndex, right: rightIndex };

        if (delta >= 0) {
            newBorderIndexes = addButtons(delta, leftIndex, rightIndex, isReverse);
        } else {
            newBorderIndexes = removeButtons(delta, leftIndex, rightIndex, selectedIndex);
        }

        mainStore.setBorders(newBorderIndexes.left, newBorderIndexes.right);
    }

    componentDidMount = () => {
        this.handleSizeUpdate();
        window.addEventListener('resize', () => this.handleSizeUpdate());
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', () => this.handleSizeUpdate());
    }
    
    handleClick = (value: any, isFlag?: boolean) => {
        if (isFlag) {
            if(value > 0) {
                this.props.mainStore?.incrementIndex() 
            } else {
                this.props.mainStore?.decrementIndex();
            }

            return;
        }
        
        this.props.mainStore?.setSelectedIndex(value);
    }

    render() {
        if (this.props.mainStore?.notValidBorders) {
            this.handleSizeUpdate(true);
        }

        const leftIndex = this.props.mainStore?.leftIndex;
        const rightIndex = this.props.mainStore?.rightIndex;

        return (
            <div className="container">
                <div className="paginator">
                    <PaginatorButton value={'<'} handleClick={() => this.handleClick(-1, true)} isArrow={true}/>
                    <div id={buttonBlockId} className="paginator-elements" key={leftIndex?.toString() + " " + rightIndex?.toString()}>
                    {
                        this.props.mainStore?.allValues.map((element, index) => 
                            <PaginatorButton 
                                value={element} 
                                handleClick={this.handleClick} 
                                index={index}
                                buttonIdText={buttonIdText}
                                isSelected={index === this.props.mainStore?.selectedIndex}
                                isHidden={(index < (this.props.mainStore?.leftIndex || 0)) || (index > (this.props.mainStore?.rightIndex || 0))}
                            />
                        )
                    }
                    </div> 
                    <PaginatorButton value={'>'} handleClick={() => this.handleClick(1, true)} isArrow={true}/>
                </div>
            </div>
        )
    }
}