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
/// * [provider] - Which payment path this package must use — \"manual\" packages go through POST /topups (QRIS + proof upload), \"doku\" packages go through POST /topups/doku/checkout. Never both.
/// * [adminFeeRupiah] - 0 for \"manual\" packages. For \"doku\" packages, a flat fee added on top of amountRupiah to cover DOKU's own transaction fee — the customer is charged amountRupiah + adminFeeRupiah, but credits granted are unaffected (always the package's own `credits`).
@BuiltValue()
abstract class TopupPackageOption implements Built<TopupPackageOption, TopupPackageOptionBuilder> {
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'credits')
  int get credits;

  /// Which payment path this package must use — \"manual\" packages go through POST /topups (QRIS + proof upload), \"doku\" packages go through POST /topups/doku/checkout. Never both.
  @BuiltValueField(wireName: r'provider')
  TopupPackageOptionProviderEnum get provider;
  // enum providerEnum {  manual,  doku,  };

  /// 0 for \"manual\" packages. For \"doku\" packages, a flat fee added on top of amountRupiah to cover DOKU's own transaction fee — the customer is charged amountRupiah + adminFeeRupiah, but credits granted are unaffected (always the package's own `credits`).
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
    yield r'provider';
    yield serializers.serialize(
      object.provider,
      specifiedType: const FullType(TopupPackageOptionProviderEnum),
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
        case r'provider':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TopupPackageOptionProviderEnum),
          ) as TopupPackageOptionProviderEnum;
          result.provider = valueDes;
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

class TopupPackageOptionProviderEnum extends EnumClass {

  /// Which payment path this package must use — \"manual\" packages go through POST /topups (QRIS + proof upload), \"doku\" packages go through POST /topups/doku/checkout. Never both.
  @BuiltValueEnumConst(wireName: r'manual')
  static const TopupPackageOptionProviderEnum manual = _$topupPackageOptionProviderEnum_manual;
  /// Which payment path this package must use — \"manual\" packages go through POST /topups (QRIS + proof upload), \"doku\" packages go through POST /topups/doku/checkout. Never both.
  @BuiltValueEnumConst(wireName: r'doku')
  static const TopupPackageOptionProviderEnum doku = _$topupPackageOptionProviderEnum_doku;

  static Serializer<TopupPackageOptionProviderEnum> get serializer => _$topupPackageOptionProviderEnumSerializer;

  const TopupPackageOptionProviderEnum._(String name): super(name);

  static BuiltSet<TopupPackageOptionProviderEnum> get values => _$topupPackageOptionProviderEnumValues;
  static TopupPackageOptionProviderEnum valueOf(String name) => _$topupPackageOptionProviderEnumValueOf(name);
}

