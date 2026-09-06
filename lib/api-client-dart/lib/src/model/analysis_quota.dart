//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/analysis_quota_hourly.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analysis_quota.g.dart';

/// AnalysisQuota
///
/// Properties:
/// * [unlimited] - True for admin/super_admin, who bypass quota
/// * [hourly] 
/// * [daily] 
@BuiltValue()
abstract class AnalysisQuota implements Built<AnalysisQuota, AnalysisQuotaBuilder> {
  /// True for admin/super_admin, who bypass quota
  @BuiltValueField(wireName: r'unlimited')
  bool get unlimited;

  @BuiltValueField(wireName: r'hourly')
  AnalysisQuotaHourly get hourly;

  @BuiltValueField(wireName: r'daily')
  AnalysisQuotaHourly get daily;

  AnalysisQuota._();

  factory AnalysisQuota([void updates(AnalysisQuotaBuilder b)]) = _$AnalysisQuota;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalysisQuotaBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalysisQuota> get serializer => _$AnalysisQuotaSerializer();
}

class _$AnalysisQuotaSerializer implements PrimitiveSerializer<AnalysisQuota> {
  @override
  final Iterable<Type> types = const [AnalysisQuota, _$AnalysisQuota];

  @override
  final String wireName = r'AnalysisQuota';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalysisQuota object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'unlimited';
    yield serializers.serialize(
      object.unlimited,
      specifiedType: const FullType(bool),
    );
    yield r'hourly';
    yield serializers.serialize(
      object.hourly,
      specifiedType: const FullType(AnalysisQuotaHourly),
    );
    yield r'daily';
    yield serializers.serialize(
      object.daily,
      specifiedType: const FullType(AnalysisQuotaHourly),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalysisQuota object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalysisQuotaBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'unlimited':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.unlimited = valueDes;
          break;
        case r'hourly':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalysisQuotaHourly),
          ) as AnalysisQuotaHourly;
          result.hourly.replace(valueDes);
          break;
        case r'daily':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalysisQuotaHourly),
          ) as AnalysisQuotaHourly;
          result.daily.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalysisQuota deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalysisQuotaBuilder();
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

