//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/alert_level_row.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'alert_status.g.dart';

/// AlertStatus
///
/// Properties:
/// * [enabled] - Convenience flag — true when at least one un-triggered, un-cancelled, in-validity alert exists.
/// * [armedCount] - Number of currently armed levels (un-triggered, un-cancelled, in-validity).
/// * [levels] 
@BuiltValue()
abstract class AlertStatus implements Built<AlertStatus, AlertStatusBuilder> {
  /// Convenience flag — true when at least one un-triggered, un-cancelled, in-validity alert exists.
  @BuiltValueField(wireName: r'enabled')
  bool get enabled;

  /// Number of currently armed levels (un-triggered, un-cancelled, in-validity).
  @BuiltValueField(wireName: r'armedCount')
  int get armedCount;

  @BuiltValueField(wireName: r'levels')
  BuiltList<AlertLevelRow> get levels;

  AlertStatus._();

  factory AlertStatus([void updates(AlertStatusBuilder b)]) = _$AlertStatus;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AlertStatusBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AlertStatus> get serializer => _$AlertStatusSerializer();
}

class _$AlertStatusSerializer implements PrimitiveSerializer<AlertStatus> {
  @override
  final Iterable<Type> types = const [AlertStatus, _$AlertStatus];

  @override
  final String wireName = r'AlertStatus';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AlertStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'enabled';
    yield serializers.serialize(
      object.enabled,
      specifiedType: const FullType(bool),
    );
    yield r'armedCount';
    yield serializers.serialize(
      object.armedCount,
      specifiedType: const FullType(int),
    );
    yield r'levels';
    yield serializers.serialize(
      object.levels,
      specifiedType: const FullType(BuiltList, [FullType(AlertLevelRow)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AlertStatus object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AlertStatusBuilder result,
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
        case r'armedCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.armedCount = valueDes;
          break;
        case r'levels':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(AlertLevelRow)]),
          ) as BuiltList<AlertLevelRow>;
          result.levels.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AlertStatus deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AlertStatusBuilder();
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

