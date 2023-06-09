/**
 * Maintains a list of dependencies for the cells in the sheet
 * 
 * Each cell has a list of cells that it depends on
 * 
 * This class provides an ordered list of cells that need to be recalculated
 * 
 * This ensures that when a cell is recalculated, all of the cells that depend on it are recalculated
 * 
 * This class is used by the MachineClass to maintain a list of cells that need to be recalculated
 * 
 * This class provides an ordered list of cells that need to be recalculated
 */

import SheetMemory from "./SheetMemory";
import Cell from "./Cell";
import TokenProcessor from "./TokenProcessor";
import Recalc from "./Recalc";



export default class RecalcDependency
{
    



    public evaluateSheet(sheetMemory:SheetMemory): void
    {
        // update the dependencies in the sheet
        this.updateDependencies(sheetMemory);
        
        // compute the computation order
        let computationOrder = this.updateComputationOrder(sheetMemory);

        // compute the cells in the computation order
        for (let cellLabel of computationOrder)
        {
            let currentCell = sheetMemory.getCellByLabel(cellLabel);
            let formula = currentCell.getFormula();
            let calculator = new Recalc();
            let [value, displayString] = calculator.evaluate(formula, sheetMemory);
            currentCell.setValue(value);
            currentCell.setDisplayString(displayString);
            sheetMemory.setCellByLabel(cellLabel, currentCell);
        }
    }
        


    /**
     * add a cell dependency to a cell
     * @param {string} cellLabel - The label of the cell
     * @param {sheetMemory} SheetMemory - The sheet memory
     * @returns {void}
     * 
     * */
    public addCellDependency(cellLabel:string, newDependsOn:string, sheetMemory:SheetMemory): void
    {
         
        let currentCell = sheetMemory.getCellByLabel(cellLabel);
        const cachedCellDependsOn:string[] = currentCell.getDependsOn();

        

        if (cachedCellDependsOn.includes(newDependsOn))
        {
            return;
        }

        // add the new dependency to the cell dependsOn to try to expand the dependencies
        let newCellDependsOn:string[] = [...cachedCellDependsOn, newDependsOn];
        
        /* set the test dependences for this cell */

        currentCell.setDependsOn(newCellDependsOn);
        let [isCircular, discoveredDependencies] = this.expandDependencies(cellLabel, sheetMemory);

        // if the cell is circular, then restore the original dependencies and return
        if (isCircular)
        {
            currentCell.setDependsOn(cachedCellDependsOn);
            return;
        }

        // lets complete the dependencies for this cell.
        let expandedDependencies = [ ...discoveredDependencies];

        /** this cell does not introduce a circular dependency,the cell dependsOn*/
        currentCell.setDependsOn(expandedDependencies);
        
        // update the cell in the sheet memory
        sheetMemory.setCellByLabel(cellLabel, currentCell);

        // update the dependencies of the sheet
        this.updateDependencies(sheetMemory);

        // update the computation order
        this.updateComputationOrder(sheetMemory);
    }

    /**
     * update the dependencies for all cells in the sheet
     * @param {sheetMemory} SheetMemory - The sheet memory
     * @returns {void}
     * 
     * */
    public updateDependencies(sheetMemory:SheetMemory): void
    {
        for(let column = 0; column < sheetMemory.getMaxColumns(); column++)
        {
            for(let row = 0; row < sheetMemory.getMaxRows(); row++)
            {
                const cellLabel = Cell.columnRowToCell(column, row);  
               
                
                let currentCell = sheetMemory.getCellByLabel(cellLabel);
                let currentFormula = currentCell.getFormula();

                // always read the top level depensOn from the formula
                let currentDependsOn = TokenProcessor.getCellReferences(currentFormula);
                currentCell.setDependsOn(currentDependsOn);
                sheetMemory.setCellByLabel(cellLabel, currentCell);
               
               
                // if the cell has no formula, then continue
                if (currentFormula.length === 0)
                {
                    continue;
                }

                // if the cell has no dependsOn, then continue
                if (currentDependsOn.length === 0)
                {
                    continue;
                }

                // if we reach here we have top level dependencies that we need to expand.
                let [isCircular, discoveredDependencies] = this.expandDependencies(cellLabel, sheetMemory);

                // This function will throw an error if a circular dependency is detected
                // updates to formulas that introduce dependencies that are circular are not allowed
                // and thus if we find it here we have failed at that task 
                if (isCircular)
                {
                  throw new Error("Circular dependency detected");
                }

                currentCell.setDependsOn(discoveredDependencies);
                sheetMemory.setCellByLabel(cellLabel, currentCell);
            }
        }
    }





  
    /**
     * recursively expand the dependencies of a cell
     * @param {string} cellLabel - The label of the cell
     * @param {sheetMemory} SheetMemory - The sheet memory
     */
    /**
     * 
     * For any cell with a dependency flush out the complete dependencies.
     * 
     * for each cell in the depends on look at the depends on of that cell
     * and to the list of dependencies for the cell
     */
    private expandDependencies(cellLabel:string, sheetMemory:SheetMemory): [boolean, string[]]
    {
        let currentCell = sheetMemory.getCellByLabel(cellLabel);
        let cellDependsOn:string[] = TokenProcessor.getCellReferences(currentCell.getFormula());
        let expandedDependencies:string[] = [];
        let isCircular:boolean = false;

        /**
         * if the cell has no dependencies, then return
         * */

        if (cellDependsOn.length === 0)
        {
            return [isCircular, expandedDependencies];
        }

        /**
         * if the cell has dependencies, then expand the dependencies
         * */
        for (let i = 0; i < cellDependsOn.length; i++)
        {
            let currentDependency = cellDependsOn[i];
            
            let currentDependencyExpandedDependencies = this.expandDependencies(currentDependency, sheetMemory);
            let currentDependencyIsCircular = currentDependencyExpandedDependencies[0];
            let currentDependencyExpandedDependenciesList = currentDependencyExpandedDependencies[1];
            
            if (currentDependencyIsCircular)
            {
                isCircular = true;
                return [isCircular, []];
            }

            
            /**
             * if the current dependency is not circular, then add the expanded dependencies to the list of expanded dependencies
             * */
            for (let j = 0; j < currentDependencyExpandedDependenciesList.length; j++)
            {
                let currentDependencyExpandedDependency = currentDependencyExpandedDependenciesList[j];
                if (expandedDependencies.indexOf(currentDependencyExpandedDependency) === -1)
                {
                    expandedDependencies.push(currentDependencyExpandedDependency);
                }
            }
            // now we add the currentDependency to the list of expanded dependencies
            if (expandedDependencies.indexOf(currentDependency) === -1)
            {
                expandedDependencies.push(currentDependency);
            }
        }

        /**
         * if the cell is already in the list of expanded dependencies, then the cell is circular
         * */
        if (expandedDependencies.indexOf(cellLabel) !== -1)
        {
          
          isCircular = true;
          return [isCircular, []];
           
        }

        return [isCircular, expandedDependencies];
    }




   



    updateComputationOrder(sheetMemory:SheetMemory): string[]
    {
      let newComputationOrder:string[] = [];
      let independentCells:string[] = [];
      
      let maxRows:number = sheetMemory.getMaxRows();
      let maxColumns:number = sheetMemory.getMaxColumns();
      for (let row = 0; row < maxRows; row++)
      {
          for (let column = 0; column < maxColumns; column++)
          {

            let currentLabel = Cell.columnRowToCell(column, row);
            const currentCell = sheetMemory.getCellByLabel(currentLabel);

            /**
             * if the cell has no dependencies, then it is an independent cell
             */
            let currentDependsOn = currentCell.getDependsOn();

            if (currentDependsOn.length === 0)
            {
                independentCells.push(currentLabel);
            }
            /**
             * if the cell has dependencies, then it is a dependent cell
             * 
             * add the cell to the computation order after the cells that it depends on
             */
            else
            {
                for (let i = 0; i < currentDependsOn.length; i++)
                {
                    let currentDependsOnLabel = currentDependsOn[i];
                    let currentDependsOnIndex = newComputationOrder.indexOf(currentDependsOnLabel);
                    if (currentDependsOnIndex === -1)
                    {
                        newComputationOrder.push(currentDependsOnLabel);
                    }
                }
                newComputationOrder.push(currentLabel);
            }
              
          }
      }
      /**
       * add the independent cells to the computation order
       *  
       * */
      for (let i = 0; i < independentCells.length; i++)
      {
          let currentLabel = independentCells[i];
          let currentLabelIndex = newComputationOrder.indexOf(currentLabel);
          if (currentLabelIndex === -1)
          {
              newComputationOrder.push(currentLabel);
          }
      }
      return newComputationOrder;
    }


}




