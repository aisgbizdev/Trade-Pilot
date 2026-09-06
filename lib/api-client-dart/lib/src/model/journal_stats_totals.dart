//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_stats_totals.g.dart';

/// JournalStatsTotals
///
/// Properties:
/// * [entries] 
/// * [wins] 
/// * [losses] 
/// * [breakevens] 
/// * [open] 
/// * [skipped] 
/// * [resolved] 
@BuiltValue()
abstract class JournalStatsTotals implements Built<JournalStatsTotals, JournalStatsTotalsBuilder> {
  @BuiltValueField(wireName: r'entries')
  int get entries;

  @BuiltValueField(wireName: r'wins')
  int get wins;

  @BuiltValueField(wireName: r'losses')
  int get losses;

  @BuiltValueField(wireName: r'breakevens')
  int get breakevens;

  @BuiltValueField(wireName: r'open')
  int get open;

  @BuiltValueField(wireName: r'skipped')
  int get skipped;

  @BuiltValueField(wireName: r'resolved')
  int get resolved;

  JournalStatsTotals._();

  factory JournalStatsTotals([void updates(JournalStatsTotalsBuilder b)]) = _$JournalStatsTotals;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalStatsTotalsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalStatsTotals> get serializer => _$JournalStatsTotalsSerializer();
}

class _$JournalStatsTotalsSerializer implements PrimitiveSerializer<JournalStatsTotals> {
  @override
  final Iterable<Type> types = const [JournalStatsTotals, _$JournalStatsTotals];

  @override
  final String wireName = r'JournalStatsTotals';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalStatsTotals object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'entries';
    yield serializers.serialize(
      object.entries,
      specifiedType: const FullType(int),
    );
    yield r'wins';
    yield serializers.serialize(
      object.wins,
      specifiedType: const FullType(int),
    );
    yield r'losses';
    yield serializers.serialize(
      object.losses,
      specifiedType: const FullType(int),
    );
    yield r'breakevens';
    yield serializers.serialize(
      object.breakevens,
      specifiedType: const FullType(int),
    );
    yield r'open';
    yield serializers.serialize(
      object.open,
      specifiedType: const FullType(int),
    );
    yield r'skipped';
    yield serializers.serialize(
      object.skipped,
      specifiedType: const FullType(int),
    );
    yield r'resolved';
    yield serializers.serialize(
      object.resolved,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalStatsTotals object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalStatsTotalsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'entries':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.entries = valueDes;
          break;
        case r'wins':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.wins = valueDes;
          break;
        case r'losses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.losses = valueDes;
          break;
        case r'breakevens':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.breakevens = valueDes;
          break;
        case r'open':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.open = valueDes;
          break;
        case r'skipped':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.skipped = valueDes;
          break;
        case r'resolved':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.resolved = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  JournalStatsTotals deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalStatsTotalsBuilder();
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

