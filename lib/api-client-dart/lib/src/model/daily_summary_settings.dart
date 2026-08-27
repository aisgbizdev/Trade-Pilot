//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'daily_summary_settings.g.dart';

/// DailySummarySettings
///
/// Properties:
/// * [enabled] 
/// * [time] - HH:MM 24h local time the digest should fire
/// * [timezone] - IANA timezone the time is interpreted in
/// * [pushDailySummary] 
/// * [lastSentDate] - YYYY-MM-DD in user's TZ; null if never sent
@BuiltValue()
abstract class DailySummarySettings implements Built<DailySummarySettings, DailySummarySettingsBuilder> {
  @BuiltValueField(wireName: r'enabled')
  bool get enabled;

  /// HH:MM 24h local time the digest should fire
  @BuiltValueField(wireName: r'time')
  String get time;

  /// IANA timezone the time is interpreted in
  @BuiltValueField(wireName: r'timezone')
  String get timezone;

  @BuiltValueField(wireName: r'pushDailySummary')
  bool get pushDailySummary;

  /// YYYY-MM-DD in user's TZ; null if never sent
  @BuiltValueField(wireName: r'lastSentDate')
  String? get lastSentDate;

  DailySummarySettings._();

  factory DailySummarySettings([void updates(DailySummarySettingsBuilder b)]) = _$DailySummarySettings;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DailySummarySettingsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DailySummarySettings> get serializer => _$DailySummarySettingsSerializer();
}

class _$DailySummarySettingsSerializer implements PrimitiveSerializer<DailySummarySettings> {
  @override
  final Iterable<Type> types = const [DailySummarySettings, _$DailySummarySettings];

  @override
  final String wireName = r'DailySummarySettings';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DailySummarySettings object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'enabled';
    yield serializers.serialize(
      object.enabled,
      specifiedType: const FullType(bool),
    );
    yield r'time';
    yield serializers.serialize(
      object.time,
      specifiedType: const FullType(String),
    );
    yield r'timezone';
    yield serializers.serialize(
      object.timezone,
      specifiedType: const FullType(String),
    );
    yield r'pushDailySummary';
    yield serializers.serialize(
      object.pushDailySummary,
      specifiedType: const FullType(bool),
    );
    if (object.lastSentDate != null) {
      yield r'lastSentDate';
      yield serializers.serialize(
        object.lastSentDate,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    DailySummarySettings object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DailySummarySettingsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'enabled':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.enabled = valueDes;
          break;
        case r'time':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.time = valueDes;
          break;
        case r'timezone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.timezone = valueDes;
          break;
        case r'pushDailySummary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.pushDailySummary = valueDes;
          break;
        case r'lastSentDate':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.lastSentDate = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DailySummarySettings deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DailySummarySettingsBuilder();
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

