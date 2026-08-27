//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_event_body.g.dart';

/// AnalyticsEventBody
///
/// Properties:
/// * [eventType] - Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
/// * [path] - Route path at event time (mainly for page_view)
/// * [metadata] - Small free-form context (e.g. {instrument, timeframe}). Capped server-side to a few KB.
@BuiltValue()
abstract class AnalyticsEventBody implements Built<AnalyticsEventBody, AnalyticsEventBodyBuilder> {
  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueField(wireName: r'eventType')
  AnalyticsEventBodyEventTypeEnum get eventType;
  // enum eventTypeEnum {  page_view,  analysis_created,  trade_logged,  alert_armed,  feedback_submitted,  };

  /// Route path at event time (mainly for page_view)
  @BuiltValueField(wireName: r'path')
  String? get path;

  /// Small free-form context (e.g. {instrument, timeframe}). Capped server-side to a few KB.
  @BuiltValueField(wireName: r'metadata')
  BuiltMap<String, JsonObject?>? get metadata;

  AnalyticsEventBody._();

  factory AnalyticsEventBody([void updates(AnalyticsEventBodyBuilder b)]) = _$AnalyticsEventBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsEventBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsEventBody> get serializer => _$AnalyticsEventBodySerializer();
}

class _$AnalyticsEventBodySerializer implements PrimitiveSerializer<AnalyticsEventBody> {
  @override
  final Iterable<Type> types = const [AnalyticsEventBody, _$AnalyticsEventBody];

  @override
  final String wireName = r'AnalyticsEventBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsEventBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'eventType';
    yield serializers.serialize(
      object.eventType,
      specifiedType: const FullType(AnalyticsEventBodyEventTypeEnum),
    );
    if (object.path != null) {
      yield r'path';
      yield serializers.serialize(
        object.path,
        specifiedType: const FullType(String),
      );
    }
    if (object.metadata != null) {
      yield r'metadata';
      yield serializers.serialize(
        object.metadata,
        specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsEventBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsEventBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'eventType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalyticsEventBodyEventTypeEnum),
          ) as AnalyticsEventBodyEventTypeEnum;
          result.eventType = valueDes;
          break;
        case r'path':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.path = valueDes;
          break;
        case r'metadata':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
          ) as BuiltMap<String, JsonObject?>?;
          if (valueDes == null) continue;
          result.metadata.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsEventBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsEventBodyBuilder();
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

class AnalyticsEventBodyEventTypeEnum extends EnumClass {

  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueEnumConst(wireName: r'page_view')
  static const AnalyticsEventBodyEventTypeEnum pageView = _$analyticsEventBodyEventTypeEnum_pageView;
  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueEnumConst(wireName: r'analysis_created')
  static const AnalyticsEventBodyEventTypeEnum analysisCreated = _$analyticsEventBodyEventTypeEnum_analysisCreated;
  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueEnumConst(wireName: r'trade_logged')
  static const AnalyticsEventBodyEventTypeEnum tradeLogged = _$analyticsEventBodyEventTypeEnum_tradeLogged;
  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueEnumConst(wireName: r'alert_armed')
  static const AnalyticsEventBodyEventTypeEnum alertArmed = _$analyticsEventBodyEventTypeEnum_alertArmed;
  /// Server validates against a fixed allowlist — unknown values are silently dropped, never persisted as-is
  @BuiltValueEnumConst(wireName: r'feedback_submitted')
  static const AnalyticsEventBodyEventTypeEnum feedbackSubmitted = _$analyticsEventBodyEventTypeEnum_feedbackSubmitted;

  static Serializer<AnalyticsEventBodyEventTypeEnum> get serializer => _$analyticsEventBodyEventTypeEnumSerializer;

  const AnalyticsEventBodyEventTypeEnum._(String name): super(name);

  static BuiltSet<AnalyticsEventBodyEventTypeEnum> get values => _$analyticsEventBodyEventTypeEnumValues;
  static AnalyticsEventBodyEventTypeEnum valueOf(String name) => _$analyticsEventBodyEventTypeEnumValueOf(name);
}

