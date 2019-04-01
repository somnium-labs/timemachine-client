import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SharedModel } from '../model/SharedModel';

@Module
export default class OptionStore extends VuexModule {
    public option!: SharedModel.TradeOption;
}
