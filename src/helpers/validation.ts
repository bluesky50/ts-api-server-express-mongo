import { Types } from 'mongoose';

export function validateInput(inputObj: any, schema: object): boolean {
	if (typeof(inputObj) !== 'object' || typeof(schema) !== 'object') {
		return false;
	}

	const schemaKeys: string[] = Object.keys(schema);
	const inputKeys: string[] = Object.keys(inputObj);

	// check if the input has the same number of keys as the schema.
	if (schemaKeys.length !== inputKeys.length) {
		return false;
	}

	// Check if object has properties and types
	for (let key of schemaKeys) {
		const index = inputKeys.indexOf(key);

		//Check if property exists.
		if(index === -1) {
			return false;
		}

		// Check if the type of value for the property.
		switch(schema[key]) {
			case 'string':
				if (!validateStringInput(inputObj[key])) return false;
				break;
			case 'number':
				if(!validateNumberInput(inputObj[key])) return false;
				break;
			case 'array':
				if(!validateArrayInput(inputObj[key])) return false;
				break;
			case 'object':
				if(!validateObjectInput(inputObj[key])) return false;
				break;
			case 'id':
				if(!validateMongoId(inputObj[key])) return false;
				break;
			default:
			// 	continue;
		}

		//Remove key from inputKeys array.
		inputKeys.splice(index, 1);
	}

	// Safety check to see if there were any additional keys.
	if (inputKeys.length > 0) {
		return false;
	}
	
	return true;
}

export function validateStringInput(value): boolean {
	if (value === undefined || value === null) return false;
	if (value && typeof(value) === 'string') return true;
	return false;
}

export function validateNumberInput(value): boolean {
	if (value === undefined || value === null) return false;
	if (value && typeof(value) === 'number') return true;
	return false;
}

export function validateArrayInput(value): boolean {
	return Array.isArray(value);
}

export function validateObjectInput(value): boolean {
	if (value === undefined || value === null) return false;
	if (value && typeof(value) === 'object') return true;
	return true;
}

export function validateMongoId(value: any): boolean {
	if (!value || value === undefined || value === null) return false;
	return Types.ObjectId.isValid(value);
}

export function testAll(...args): boolean {
	const func = arguments[0];

	for (let i = 1; i < arguments.length; i++) {
		if (!func(arguments[i])) return false;
	}

	return true;
}