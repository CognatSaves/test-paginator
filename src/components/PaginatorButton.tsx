import React from 'react';
import '../styles/paginatorButton.scss';

export default function PaginatorButton(props: any) {
  const { value, handleClick, index, isSelected, isArrow, isHidden, buttonIdText } = props;
    
  return (
      <button 
        className={"paginatorButton " + (isSelected ? 'selected ' : '') + (isArrow ? 'arrow ' : '') + (isHidden ? 'hidden ' : '')}
        key={(index + 1) ? (buttonIdText + index.toString()) : null}
        id={(index + 1) ? (buttonIdText + index.toString()) : null}
        onClick={() => handleClick(index)}
      >{value}</button>
    )  
}