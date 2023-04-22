import {Validator} from "../src/validators/Validator";
import {commonMessages, messages} from "../src/constants/messages";
import {ValidationError} from "../src/errors/ValidationError";
import {buildErrorMsg} from "../src/utils/buildErrorMsg";

const throwError = (v: Validator, input: string) => {
  const errors = v.getErrorMessages(input);
  return new ValidationError(buildErrorMsg(v.name), errors);
}

describe("Validator", () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  it("should set minLength", () => {
    validator.minLength(5);
    expect((validator as any).minLengthFlag.value).toEqual(5);
  });

  it("should have a name", () => {
    validator = new Validator("German")
    expect(validator.name).toEqual("German");
  });

  it("should not have a name", () => {
    validator = new Validator()
    expect(validator.name).toBeNull();
  });

  it("should throw error if minLength is greater than maxLength", () => {
    validator.maxLength(4);
    expect(() => validator.minLength(5)).toThrow(messages.minLengthGreaterThanMax);
  });

  it("should throw error if minLength is less than 0", () => {
    expect(() => validator.minLength(-1)).toThrow(messages.minLengthSmallerThanZero);
  });

  describe("isValid", () => {
    it("should return true if the input is not valid", () => {
      validator.minLength(6);
      expect(validator.isValid("shortyyyy")).toBe(true);
    });

    it("should return false if the input is valid", () => {
        validator.minLength(6);
        expect(validator.isValid("short")).toBe(false);
    });
  })

  describe("assertIsValid", () => {
    it("should throw error if password length is less than minLength", () => {
      validator.minLength(6);
      expect(() => validator.assertIsValid("short")).toThrow(
        messages.minLength
      );
    });

    describe("maxLength", () => {
      it("should throw error if password length is greater than maxLength", () => {
        validator.maxLength(10, "some message");
        expect(() => validator.validate("thisisaverylongpassword")).toThrow(
            throwError(validator, "thisisaverylongpassword")
        );
      });

      it("should throw error if max length is smaller than 1", () => {
        expect(() => validator.maxLength(0)).toThrow(messages.maxLengthSmallerThanOne);
      });

      it("should throw error if max length is smaller than min", () => {
        validator.minLength(5);
        expect(() => validator.maxLength(3)).toThrow(messages.maxLengthSmallerThanMin);
      });
    });

    describe("requireNumber", () => {
      it("should throw error if password does not contain a number", () => {
        validator.requireNumber();
        expect(() => validator.assertIsValid("NoNumber")).toThrow( messages.hasNumber);
      });
    });

    describe("notNull", () => {
        it("should throw error if the input is null", () => {
            validator.notNull();
            // @ts-ignore
            expect(validator.getErrorMessages(undefined)).toEqual([commonMessages.notNull]);
        });
    })

    describe("requireSpecialCharacter", () => {
      it("should throw error if password does not contain a special character", () => {
        validator.requireSpecialCharacter();
        expect(() => validator.assertIsValid("NoSpecialChar")).toThrow(
          messages.hasSpecialCharacter
        );
      });
    });

    describe("noWhitespaces", () => {
      it("should throw error if password contains whitespace", () => {
        validator.noWhitespaces();
        expect(() => validator.assertIsValid("Has Whitespace")).toThrow(
          messages.noWhitespaces
        );
      });
    });

    describe("noNumbers", () => {
      it("should throw error if password contains a number", () => {
        validator.noNumbers();
        expect(() => validator.assertIsValid("Has1Number")).toThrow(
          messages.noNumbers
        );
      });
    });

    describe("noSpecialCharacters", () => {
      it("should throw error if password contains a special character", () => {
        validator.noSpecialCharacters();
        expect(() => validator.assertIsValid("Has@SpecialChar")).toThrow(
          messages.noSpecialCharacters
        );
      });
    });

    describe("notBlank", () => {
      it("should throw error if the input has only whitespaces or is empty", () => {
        validator.notBlank();

        expect(() => validator.validate("   ")).toThrow(throwError(validator, "   "));
        expect(() => validator.validate("")).toThrow(throwError(validator, ""));
      });

        it("should not throw error if the input has only whitespaces or is empty", () => {
            validator.notBlank();
            expect(() => validator.validate("not blank")).not.toThrow();
        });
    });

    describe("notEmpty", () => {
      it("should throw error if the input is empty", () => {
        validator.notBlank();

        expect(() => validator.validate("")).toThrow(throwError(validator, ""));
      });

      it("should not throw error if the input has only whitespaces", () => {
        validator.notBlank();
        expect(() => validator.validate("   ")).toThrow(throwError(validator, "   "));
      });
    });

    describe("onlyNumbers", () => {
      it("should throw error if password contains non-numeric characters", () => {
        validator.onlyNumbers();
        expect(() => validator.assertIsValid("NotOnly1234")).toThrow(
          messages.onlyNumbers
        );
      });
    });

    describe("noRepeatedCharacters", () => {
      it("should throw error if password contains repeated characters", () => {
        validator.noRepeatedCharacters();
        expect(() => validator.assertIsValid("Repeeeated")).toThrow(
          messages.noRepeatedCharacters
        );
      });

      it("should not throw error if value does not contains any repeated characters", () => {
        validator.noRepeatedCharacters();
        expect(() => validator.assertIsValid("repato")).not.toThrow();
      });
    });

    describe("onlyCharacters", () => {
      it("should throw error if password contains non-alphabetic characters", () => {
        validator.onlyCharacters();
        expect(() => validator.assertIsValid("NotOnlyChars123")).toThrow(
          messages.onlyCharacters
        );
      });
    });

    describe("isEmail", () => {
      it("should throw error if is not a valid email", () => {
        const message = "ese mail no es valido"
        validator.isEmail(message);
        expect(() => validator.assertIsValid("NotOnlyChars123")).toThrow(
            message
        );
      });

        it("should not throw error if is a valid email", () => {
          validator.isEmail();
          expect(() => validator.assertIsValid("german@mail.com")).not.toThrow(messages.isEmail);
        });
    });

    describe("isUrl", () => {
        it("should throw error if is not a valid url", () => {
          validator.isUrl();
          expect(() => validator.assertIsValid("NotOnlyChars123")).toThrow(messages.isUrl);
        });

        it("should not throw error if is a valid url", () => {
          validator.isUrl();
          expect(() => validator.assertIsValid("https://google.com")).not.toThrow(messages.isUrl);
        });

      it("should not throw error if is a valid url without http or https", () => {
        validator.isUrl();
        expect(() => validator.assertIsValid("google.com")).not.toThrow(messages.isUrl);
      });
    });

    describe("addCustomRule", () => {
      it("should throw error if password does not meet the custom rule", () => {
        validator.addRule((password: string) =>
          password.includes("test"), "custom message"
        );
        expect(() => validator.assertIsValid("NoTestPhrase")).toThrow(
            "custom message"
        );
      });
    });
  });

  describe("requireUppercase and requireLowercase", () => {
    it("should throw error if password does not contain an uppercase letter", () => {
      validator.requireUppercase();
      expect(() => validator.assertIsValid("lowercase")).toThrow(
        messages.hasUppercase
      );
    });

    it("should throw error if password does not contain a lowercase letter", () => {
      validator.requireLowercase();
      expect(() => validator.assertIsValid("UPPERCASE")).toThrow(
        messages.hasLowercase
      );
    });
  });

  describe("fixedLength", () => {
    it("should throw error if the input does not have the right length", () => {
      validator.fixedLength(5, "custom message");
      expect(() => validator.validate("lowercase")).toThrow(
          throwError(validator, "lowercase")
      );
    });

    it("should not throw error with correct length", () => {
      validator.fixedLength(3);
      expect(() => validator.assertIsValid("UP1")).not.toThrow();
    });

    it("should throw an error if fixed length is less than 1", () => {
      expect(() => validator.fixedLength(0)).toThrow();
    });

    it("should throw and error if min and max are used with fixedLength", () => {
      validator.minLength(3).maxLength(7)
        expect(() => validator.fixedLength(3)).toThrow();
    });

    it("should throw and error if min are used with fixedLength", () => {
      validator.minLength(3);
      expect(() => validator.fixedLength(3)).toThrow();
    });

    it("should throw and error if max are used with fixedLength", () => {
      validator.maxLength(3);
      expect(() => validator.fixedLength(3)).toThrow();
    });
  });

  describe("isNullable", () => {
    it("should not throw error if the input is null", () => {
      validator.isNullable();
      // @ts-ignore
      expect(validator.getErrorMessages(null)).toEqual([]);
    });

    it("should not throw error if the input is undefined", () => {
        validator.isNullable();
        // @ts-ignore
        expect(validator.getErrorMessages(undefined)).toEqual([]);
    });
  });

  describe("not null", () => {
    it("should throw error if the input is null", () => {
      validator.isNullable();
      // @ts-ignore
      expect(validator.getErrorMessages(null)).toEqual([]);
    });

    it("should throw error if the input is undefined", () => {
      validator.isNullable();
      // @ts-ignore
      expect(validator.getErrorMessages(undefined)).toEqual([]);
    });
  });

  describe("chaining validations", () => {
    it("it should throw an error with an array with all the messages", () => {
      validator
          .requireLowercase("It requires a lowercase letter")
          .requireUppercase("It requires an uppercase letter")
          .requireNumber("It requires a number")
          .requireSpecialCharacter("It requires a special character")
          .minLength(8, "It requires at least 8 characters")
          .maxLength(20, "It requires at most 20 characters")
          .noWhitespaces("It cannot contain whitespaces");

      const messages = validator.getErrorMessages("noch ar");

        expect(messages.sort()).toEqual([
          "It requires at least 8 characters",
          "It requires an uppercase letter",
          "It requires a number",
          "It cannot contain whitespaces"
        ].sort());
        expect(() => validator.validate("noch ar")).toThrow(throwError(validator, "noch ar"));
    });

    it("it should not throw an error if the password is valid", () => {
      validator
          .requireLowercase("It requires a lowercase letter")
          .requireUppercase("It requires an uppercase letter")
          .requireNumber("It requires a number")
          .requireSpecialCharacter("It requires a special character")
          .minLength(8, "It requires at least 8 characters")
          .maxLength(20, "It requires at most 20 characters")
          .noWhitespaces("It cannot contain whitespaces");

        expect(() => validator.validate("ValidPassword1!")).not.toThrow();
    });

  });

  describe("validation for combination of rules", () => {

    it("should throw error if onlyNumbers is used with noNumbers", () => {
        validator.onlyNumbers();
        expect(() => validator.noNumbers()).toThrow();
    });

    it("should throw error if hasOnlyChars is used with hasOnlyNumbers", () => {
      validator.onlyCharacters();
      expect(() => validator.onlyNumbers()).toThrow();
    });

    it("should throw error if requireSpecialChars is used with noSpecialChars", () => {
      validator.noSpecialCharacters();
      expect(() => validator.requireSpecialCharacter()).toThrow();
    });


    it("should throw error if noNumbers is used with onlyNumbers", () => {
      validator.noNumbers();
      expect(() => validator.onlyNumbers()).toThrow();
    });

    it("should throw error if hasNumber is used with noNumbers", () => {
      validator.noNumbers();
      expect(() => validator.requireNumber()).toThrow();
    });

    it("should throw error if hasSpecialCharacter is used with noSpecialCharacters", () => {
        validator.requireSpecialCharacter();
        expect(() => validator.noSpecialCharacters()).toThrow();
    });

    it("should throw error if noNumbers is used with requires a number", () => {
       validator.noNumbers();
       expect(() => validator.requireNumber()).toThrow();
    });

    it("should throw error if requireNumber is used with noNumbers", () => {
      validator.requireNumber();
      expect(() => validator.noNumbers()).toThrow();
    });

    describe("min and max with fixedLength", () => {
        it("should throw error if min is used with fixedLength", () => {
            validator.minLength(3);
            expect(() => validator.fixedLength(3)).toThrow();
        });

        it("should throw error if max is used with fixedLength", () => {
            validator.maxLength(3);
            expect(() => validator.fixedLength(3)).toThrow();
        });

      it("should throw error if fixedLength is used with max", () => {
        validator.fixedLength(3);
        expect(() => validator.maxLength(3)).toThrow();
      });

      it("should throw error if fixedLength is used with min", () => {
        validator.fixedLength(3);
        expect(() => validator.minLength(3)).toThrow();
      });
    });

  });

  describe("messages validations", () => {

    it("url: should set a message when passed by argument", () => {
        validator.isUrl("custom message");
        expect(validator.getErrorMessages("test")).toEqual(["custom message"]);
    });

    it("no numbers: should set a message when passed by argument", () => {
      validator.noNumbers("custom message");
      expect(validator.getErrorMessages("1")).toEqual(["custom message"]);
    });

    it("no special chars: should set a message when passed by argument", () => {
      validator.noSpecialCharacters("custom message");
      expect(validator.getErrorMessages("1$")).toEqual(["custom message"]);
    });

    it("only numbers: should set a message when passed by argument", () => {
      validator.onlyNumbers("custom message");
      expect(validator.getErrorMessages("1$")).toEqual(["custom message"]);
    });

    it("only chars: should set a message when passed by argument", () => {
      validator.onlyCharacters("custom message");
      expect(validator.getErrorMessages("1$")).toEqual(["custom message"]);
    });

    it("no repeated chars: should set a message when passed by argument", () => {
      validator.noRepeatedCharacters("custom message");
      expect(validator.getErrorMessages("1$1")).toEqual(["custom message"]);
    });

  })

});
