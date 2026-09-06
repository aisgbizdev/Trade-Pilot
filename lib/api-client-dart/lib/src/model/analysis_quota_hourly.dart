//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_quota_hourly.g.dart';

/// AnalysisQuotaHourly
///
/// Properties:
/// * [limit] 
/// * [used] 
/// * [remaining] 
@BuiltValue()
abstract class AnalysisQuotaHourly implements Built<AnalysisQuotaHourly, AnalysisQuotaHourlyBuilder> {
  @BuiltValueField(wireName: r'limit')
  int get limit;

  @BuiltValueField(wireName: r'used')
  int get used;

  @BuiltValueField(wireName: r'remaining')
  int get remaining;

  AnalysisQuotaHourly._();

  factory AnalysisQuotaHourly([void updates(AnalysisQuotaHourlyBuilder b)]) = _$AnalysisQuotaHourly;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisQuotaHourlyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisQuotaHourly> get serializer => _$AnalysisQuotaHourlySerializer();
}

class _$AnalysisQuotaHourlySerializer implements PrimitiveSerializer<AnalysisQuotaHourly> {
  @override
  final Iterable<Type> types = const [AnalysisQuotaHourly, _$AnalysisQuotaHourly];

  @override
  final String wireName = r'AnalysisQuotaHourly';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisQuotaHourly object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'limit';
    yield serializers.serialize(
      object.limit,
      specifiedType: const FullType(int),
    );
    yield r'used';
    yield serializers.serialize(
      object.used,
      specifiedType: const FullType(int),
    );
    yield r'remaining';
    yield serializers.serialize(
      object.remaining,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisQuotaHourly object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisQuotaHourlyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'limit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.limit = valueDes;
          break;
        case r'used':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.used = valueDes;
          break;
        case r'remaining':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.remaining = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisQuotaHourly deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisQuotaHourlyBuilder();
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

