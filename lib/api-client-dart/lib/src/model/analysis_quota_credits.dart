//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_quota_credits.g.dart';

/// AnalysisQuotaCredits
///
/// Properties:
/// * [balance] 
@BuiltValue()
abstract class AnalysisQuotaCredits implements Built<AnalysisQuotaCredits, AnalysisQuotaCreditsBuilder> {
  @BuiltValueField(wireName: r'balance')
  int get balance;

  AnalysisQuotaCredits._();

  factory AnalysisQuotaCredits([void updates(AnalysisQuotaCreditsBuilder b)]) = _$AnalysisQuotaCredits;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisQuotaCreditsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisQuotaCredits> get serializer => _$AnalysisQuotaCreditsSerializer();
}

class _$AnalysisQuotaCreditsSerializer implements PrimitiveSerializer<AnalysisQuotaCredits> {
  @override
  final Iterable<Type> types = const [AnalysisQuotaCredits, _$AnalysisQuotaCredits];

  @override
  final String wireName = r'AnalysisQuotaCredits';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisQuotaCredits object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'balance';
    yield serializers.serialize(
      object.balance,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisQuotaCredits object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisQuotaCreditsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'balance':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.balance = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisQuotaCredits deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisQuotaCreditsBuilder();
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

