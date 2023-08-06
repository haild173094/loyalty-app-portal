export const isVisibleField = (
  field: Record<string, any>,
  fields: Record<string, any>[],
  data: Record<string, any>,
): boolean => {
  // #1. No dependency
  if (!field.dependency) {
    return true;
  }

  // #2. Has dependency

  // There're 2 types of value
  //  - primary (1): String/Number/Boolean
  //  - object (n): Array/Object
  // There're 2 supported relationships
  //
  // |--------|---------|-------------------------
  // | Master | Servant | Checking value(s)
  // |--------|---------|-------------------------
  // |   1    |    1    | value/value_not_equal/has_value
  // |   1    |    n    | value_in/value_not_in
  const {
    element,
    value,
    value_not_equal: valueNotEqual,
    value_in: valueIn,
    value_not_in: valueNotIn,
    has_value: hasValue,
  } = field.dependency;

  if (!element) {
    throw new Error(`Option ${field.name}: dependency element is undefined`);
  }

  const dependencyField = (fields as Record<string, any>[]).find(f => f.name === element);

  if (!dependencyField) {
    throw new Error(`Option ${field.name}: dependency ${element} does not exist!`);
  }

  const dependencyValue = (data as Record<string, any>)[element];

  // 1. Value equal
  if (value !== undefined) {
    // this will not work in case of using dependency as below
    // <?php
    //    // no 'default_value'
    //    'dependency' => [
    //      'element' => 'dependency_element',
    //      'value' => false,
    //    ],
    // ?>
    // in that case: data[element] === undefined !== false
    // ==> Solution: if an field depends on a Boolean field, only use 'value' => true or
    //               change logic to use 'value_not_equal'
    if (dependencyValue === value) {
      // Multiple level
      return dependencyField.dependency ? isVisibleField(dependencyField, fields, data) : true;
    }
  }

  // 2. Value not equal
  if (valueNotEqual !== undefined) {
    if (dependencyValue !== valueNotEqual) {
      // Multiple level
      return dependencyField.dependency ? isVisibleField(dependencyField, fields, data) : true;
    }
  }

  // 3. Value in
  if (valueIn !== undefined) {
    const values = valueIn.map((v: any) => v.trim());

    if (values.includes(dependencyValue)) {
      // Multiple level
      return dependencyField.dependency ? isVisibleField(dependencyField, fields, data) : true;
    }
  }

  // 4. Value not in
  if (valueNotIn !== undefined) {
    const values = valueNotIn.map((v: any) => v.trim());

    if (!values.includes(dependencyValue)) {
      // Multiple level
      return dependencyField.dependency ? isVisibleField(dependencyField, fields, data) : true;
    }
  }

  // 5. Has value
  if (hasValue !== undefined) {
    if (dependencyValue) {
      // Multiple level
      return dependencyField.dependency ? isVisibleField(dependencyField, fields, data) : true;
    }
  }

  return false;
};

export type InputDataType = Event | boolean | string | Record<string, any>;
