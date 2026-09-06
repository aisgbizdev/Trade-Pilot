//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/progression_ledger_entry.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'progression_history.g.dart';

/// ProgressionHistory
///
/// Properties:
/// * [entries] 
@BuiltValue()
abstract class ProgressionHistory implements Built<ProgressionHistory, ProgressionHistoryBuilder> {
  @BuiltValueField(wireName: r'entries')
  BuiltList<ProgressionLedgerEntry> get entries;

  ProgressionHistory._();

  factory ProgressionHistory([void updates(ProgressionHistoryBuilder b)]) = _$ProgressionHistory;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ProgressionHistoryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ProgressionHistory> get serializer => _$ProgressionHistorySerializer();
}

class _$ProgressionHistorySerializer implements PrimitiveSerializer<ProgressionHistory> {
  @override
  final Iterable<Type> types = const [ProgressionHistory, _$ProgressionHistory];

  @override
  final String wireName = r'ProgressionHistory';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ProgressionHistory object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'entries';
    yield serializers.serialize(
      object.entries,
      specifiedType: const FullType(BuiltList, [FullType(ProgressionLedgerEntry)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ProgressionHistory object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ProgressionHistoryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'entries':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(ProgressionLedgerEntry)]),
          ) as BuiltList<ProgressionLedgerEntry>;
          result.entries.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ProgressionHistory deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ProgressionHistoryBuilder();
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

