//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_package_option.g.dart';

/// One fixed top-up package (see lib/credits.ts) — bigger packages give a better effective per-credit rate.
///
/// Properties:
/// * [amountRupiah] 
/// * [credits] 
/// * [dokuMethods] - Which DOKU Checkout methods this package may use with POST /topups/doku/checkout. Every package supports at least \"qris\"; only the smallest package doesn't also support \"va\".
/// * [adminFeeRupiah] - The flat fee added on top of amountRupiah when paying via the \"va\" method (covers DOKU's own VA transaction fee) — irrelevant when only \"qris\" is chosen, which carries no fee. Credits granted are unaffected either way (always the package's own `credits`).
@BuiltValue()
abstract class TopupPackageOption implements Built<TopupPackageOption, TopupPackageOptionBuilder> {
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'credits')
  int get credits;

  /// Which DOKU Checkout methods this package may use with POST /topups/doku/checkout. Every package supports at least \"qris\"; only the smallest package doesn't also support \"va\".
  @BuiltValueField(wireName: r'dokuMethods')
  BuiltList<TopupPackageOptionDokuMethodsEnum> get dokuMethods;
  // enum dokuMethodsEnum {  va,  qris,  };

  /// The flat fee added on top of amountRupiah when paying via the \"va\" method (covers DOKU's own VA transaction fee) — irrelevant when only \"qris\" is chosen, which carries no fee. Credits granted are unaffected either way (always the package's own `credits`).
  @BuiltValueField(wireName: r'adminFeeRupiah')
  int get adminFeeRupiah;

  TopupPackageOption._();

  factory TopupPackageOption([void updates(TopupPackageOptionBuilder b)]) = _$TopupPackageOption;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupPackageOptionBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupPackageOption> get serializer => _$TopupPackageOptionSerializer();
}

class _$TopupPackageOptionSerializer implements PrimitiveSerializer<TopupPackageOption> {
  @override
  final Iterable<Type> types = const [TopupPackageOption, _$TopupPackageOption];

  @override
  final String wireName = r'TopupPackageOption';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupPackageOption object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'credits';
    yield serializers.serialize(
      object.credits,
      specifiedType: const FullType(int),
    );
    yield r'dokuMethods';
    yield serializers.serialize(
      object.dokuMethods,
      specifiedType: const FullType(BuiltList, [FullType(TopupPackageOptionDokuMethodsEnum)]),
    );
    yield r'adminFeeRupiah';
    yield serializers.serialize(
      object.adminFeeRupiah,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupPackageOption object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupPackageOptionBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'credits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.credits = valueDes;
          break;
        case r'dokuMethods':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TopupPackageOptionDokuMethodsEnum)]),
          ) as BuiltList<TopupPackageOptionDokuMethodsEnum>;
          result.dokuMethods.replace(valueDes);
          break;
        case r'adminFeeRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.adminFeeRupiah = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupPackageOption deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupPackageOptionBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class TopupPackageOptionDokuMethodsEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'va')
  static const TopupPackageOptionDokuMethodsEnum va = _$topupPackageOptionDokuMethodsEnum_va;
  @BuiltValueEnumConst(wireName: r'qris')
  static const TopupPackageOptionDokuMethodsEnum qris = _$topupPackageOptionDokuMethodsEnum_qris;

  static Serializer<TopupPackageOptionDokuMethodsEnum> get serializer => _$topupPackageOptionDokuMethodsEnumSerializer;

  const TopupPackageOptionDokuMethodsEnum._(String name): super(name);

  static BuiltSet<TopupPackageOptionDokuMethodsEnum> get values => _$topupPackageOptionDokuMethodsEnumValues;
  static TopupPackageOptionDokuMethodsEnum valueOf(String name) => _$topupPackageOptionDokuMethodsEnumValueOf(name);
}

