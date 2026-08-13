//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/journal_entry.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_entry_list.g.dart';

/// JournalEntryList
///
/// Properties:
/// * [entries] 
@BuiltValue()
abstract class JournalEntryList implements Built<JournalEntryList, JournalEntryListBuilder> {
  @BuiltValueField(wireName: r'entries')
  BuiltList<JournalEntry> get entries;

  JournalEntryList._();

  factory JournalEntryList([void updates(JournalEntryListBuilder b)]) = _$JournalEntryList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalEntryListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalEntryList> get serializer => _$JournalEntryListSerializer();
}

class _$JournalEntryListSerializer implements PrimitiveSerializer<JournalEntryList> {
  @override
  final Iterable<Type> types = const [JournalEntryList, _$JournalEntryList];

  @override
  final String wireName = r'JournalEntryList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalEntryList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'entries';
    yield serializers.serialize(
      object.entries,
      specifiedType: const FullType(BuiltList, [FullType(JournalEntry)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalEntryList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalEntryListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'entries':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(JournalEntry)]),
          ) as BuiltList<JournalEntry>;
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
  JournalEntryList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalEntryListBuilder();
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

