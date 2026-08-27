//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'performance_banner.g.dart';

/// Honesty banner comparing the last `recentDays` hit-rate against the 30-day baseline. `severity: warn` fires only when recent is >=15pp below baseline AND both windows cleared the minimum-sample guardrail.
///
/// Properties:
/// * [severity] 
/// * [recentDays] 
/// * [recentSample] 
/// * [baselineSample] 
/// * [recentHitRate] 
/// * [baselineHitRate] 
/// * [delta] 
@BuiltValue()
abstract class PerformanceBanner implements Built<PerformanceBanner, PerformanceBannerBuilder> {
  @BuiltValueField(wireName: r'severity')
  PerformanceBannerSeverityEnum get severity;
  // enum severityEnum {  ok,  watch,  warn,  };

  @BuiltValueField(wireName: r'recentDays')
  int get recentDays;

  @BuiltValueField(wireName: r'recentSample')
  int get recentSample;

  @BuiltValueField(wireName: r'baselineSample')
  int get baselineSample;

  @BuiltValueField(wireName: r'recentHitRate')
  num get recentHitRate;

  @BuiltValueField(wireName: r'baselineHitRate')
  num get baselineHitRate;

  @BuiltValueField(wireName: r'delta')
  num get delta;

  PerformanceBanner._();

  factory PerformanceBanner([void updates(PerformanceBannerBuilder b)]) = _$PerformanceBanner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(PerformanceBannerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<PerformanceBanner> get serializer => _$PerformanceBannerSerializer();
}

class _$PerformanceBannerSerializer implements PrimitiveSerializer<PerformanceBanner> {
  @override
  final Iterable<Type> types = const [PerformanceBanner, _$PerformanceBanner];

  @override
  final String wireName = r'PerformanceBanner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    PerformanceBanner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'severity';
    yield serializers.serialize(
      object.severity,
      specifiedType: const FullType(PerformanceBannerSeverityEnum),
    );
    yield r'recentDays';
    yield serializers.serialize(
      object.recentDays,
      specifiedType: const FullType(int),
    );
    yield r'recentSample';
    yield serializers.serialize(
      object.recentSample,
      specifiedType: const FullType(int),
    );
    yield r'baselineSample';
    yield serializers.serialize(
      object.baselineSample,
      specifiedType: const FullType(int),
    );
    yield r'recentHitRate';
    yield serializers.serialize(
      object.recentHitRate,
      specifiedType: const FullType(num),
    );
    yield r'baselineHitRate';
    yield serializers.serialize(
      object.baselineHitRate,
      specifiedType: const FullType(num),
    );
    yield r'delta';
    yield serializers.serialize(
      object.delta,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    PerformanceBanner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required PerformanceBannerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'severity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(PerformanceBannerSeverityEnum),
          ) as PerformanceBannerSeverityEnum;
          result.severity = valueDes;
          break;
        case r'recentDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.recentDays = valueDes;
          break;
        case r'recentSample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.recentSample = valueDes;
          break;
        case r'baselineSample':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.baselineSample = valueDes;
          break;
        case r'recentHitRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.recentHitRate = valueDes;
          break;
        case r'baselineHitRate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.baselineHitRate = valueDes;
          break;
        case r'delta':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.delta = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  PerformanceBanner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = PerformanceBannerBuilder();
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

class PerformanceBannerSeverityEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'ok')
  static const PerformanceBannerSeverityEnum ok = _$performanceBannerSeverityEnum_ok;
  @BuiltValueEnumConst(wireName: r'watch')
  static const PerformanceBannerSeverityEnum watch = _$performanceBannerSeverityEnum_watch;
  @BuiltValueEnumConst(wireName: r'warn')
  static const PerformanceBannerSeverityEnum warn = _$performanceBannerSeverityEnum_warn;

  static Serializer<PerformanceBannerSeverityEnum> get serializer => _$performanceBannerSeverityEnumSerializer;

  const PerformanceBannerSeverityEnum._(String name): super(name);

  static BuiltSet<PerformanceBannerSeverityEnum> get values => _$performanceBannerSeverityEnumValues;
  static PerformanceBannerSeverityEnum valueOf(String name) => _$performanceBannerSeverityEnumValueOf(name);
}

