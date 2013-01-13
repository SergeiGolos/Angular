module angular {
    interface NgModelController {
        $viewValue: string;
        $modelValue: any;
        $parsers: ModelParser[];
        $formatters: ModelFormatter[];
        $error;
        $pristine: bool;
        $dirty: bool;
        $valid: bool;
        $invalid: bool;

        $render(): void;
        $setViewValue(value: any): void;
        $setValidity(validationErrorKey: string, isValid: bool): void;
    }

    interface ModelParser {
        (value: any): any;
    }

    interface ModelFormatter {
        (value: any): any;
    }
}