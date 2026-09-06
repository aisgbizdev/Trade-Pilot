//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'daily_summary_settings_update.g.dart';

/// DailySummarySettingsUpdate
///
/// Properties:
/// * [enabled] 
/// * [time] 
/// * [timezone] 
@BuiltValue()
abstract class DailySummarySettingsUpdate implements Built<DailySummarySettingsUpdate, DailySummarySettingsUpdateBuilder> {
  @BuiltValueField(wireName: r'enabled')
  bool? get enabled;

  @BuiltValueField(wireName: r'time')
  String? get time;

  @BuiltValueField(wireName: r'timezone')
  String? get timezone;

  DailySummarySettingsUpdate._();

  factory DailySummarySettingsUpdate([void updates(DailySummarySettingsUpdateBuilder b)]) = _$DailySummarySettingsUpdate;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DailySummarySettingsUpdateBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DailySummarySettingsUpdate> get serializer => _$DailySummarySettingsUpdateSerializer();
}

class _$DailySummarySettingsUpdateSerializer implements PrimitiveSerializer<DailySummarySettingsUpdate> {
  @override
  final Iterable<Type> types = const [DailySummarySettingsUpdate, _$DailySummarySettingsUpdate];

  @override
  final String wireName = r'DailySummarySettingsUpdate';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DailySummarySettingsUpdate object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.enabled != null) {
      yield r'enabled';
      yield serializers.serialize(
        object.enabled,
        specifiedType: const FullType(bool),
      );
    }
    if (object.time != null) {
      yield r'time';
      yield serializers.serialize(
        object.time,
        specifiedType: const FullType(String),
      );
    }
    if (object.timezone != null) {
      yield r'timezone';
      yield serializers.serialize(
        object.timezone,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    DailySummarySettingsUpdate object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DailySummarySettingsUpdateBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'enabled':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.enabled = valueDes;
          break;
        case r'time':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.time = valueDes;
          break;
        case r'timezone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.timezone = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DailySummarySettingsUpdate deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DailySummarySettingsUpdateBuilder();
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

