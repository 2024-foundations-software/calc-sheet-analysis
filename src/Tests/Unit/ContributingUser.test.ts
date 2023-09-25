import { ContributingUser } from '../../Engine/ContributingUser';
import { FormulaBuilder } from '../../Engine/FormulaBuilder';

describe('ContributingUser', () => {
    let user: ContributingUser;

    beforeEach(() => {
        user = new ContributingUser('A1');
    });

    it('should set and get the cell label', () => {
        user.cellLabel = 'B2';
        expect(user.cellLabel).toEqual('B2');
    });

    it('should set and get the editing state', () => {
        user.isEditing = true;
        expect(user.isEditing).toEqual(true);
    });

    it('should get the formula builder', () => {
        expect(user.formulaBuilder).toBeInstanceOf(FormulaBuilder);
    });
});