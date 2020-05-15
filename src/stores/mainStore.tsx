import { action, observable } from 'mobx';

const defaultValues = [ 
'all', 'new', 'popular', 'keno', 'table', 'lottery',
'all1', 'new1', 'popular1', 'keno1', 'table1', 'lottery1',
'all2', 'new2', 'popular2', 'keno2', 'table2', 'lottery2',
'all3', 'new3', 'popular3', 'keno3', 'table3', 'lottery3',
'all4', 'new4', 'popular4', 'keno4', 'table4', 'lottery4',
'all5', 'new5', 'popular5', 'keno5', 'table5', 'lottery5'
];

export interface IMainStore {
    leftIndex: number;
    rightIndex: number;
    selectedIndex: number;
    notValidBorders: boolean;
    allValues: Array<String>;
    setSelectedIndex(index: number): void;
    incrementIndex(): void;
    decrementIndex(): void;
    setBorders(left: number, right: number): void;
}

export class MainStore implements IMainStore {
    @observable leftIndex = 0;
    @observable rightIndex = 5;

    @observable selectedIndex = 0;
    @observable allValues = defaultValues;
    @observable notValidBorders = false;

    @action
    public setSelectedIndex = (index: number) => {
        this.selectedIndex = index;
        this.notValidBorders = !this.validate();
    }

    @action
    public incrementIndex = () => {
        let selectedIndex = this.selectedIndex + 1;
        if (selectedIndex >= this.allValues.length) {
            selectedIndex = 0;
        }

        this.selectedIndex = selectedIndex
        this.notValidBorders = !this.validate();
    }

    @action
    public decrementIndex = () => {
        let selectedIndex = this.selectedIndex - 1;
        if (selectedIndex < 0) {
            selectedIndex = this.allValues.length - 1;
        }

        this.selectedIndex = selectedIndex;
        this.notValidBorders = !this.validate();
    }

    @action
    public setBorders = (left: number, right: number) => {
        if (left > this.selectedIndex || right < this.selectedIndex) {
            return;   
        }
        
        this.leftIndex = left;
        this.rightIndex = right;
        this.notValidBorders = false;    
    }

    @action
    private validate = () => {
        return !(this.leftIndex > this.selectedIndex || this.rightIndex < this.selectedIndex);
    }
}